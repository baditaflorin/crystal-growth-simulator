#include "phase_field_reference.hpp"

#include <algorithm>
#include <cmath>

namespace crystal {
namespace {

constexpr int kStride = 4;

float Clamp01(float value) { return std::clamp(value, 0.0F, 1.0F); }

int Wrap(int value, int size) {
  if (value < 0) {
    return size - 1;
  }
  if (value >= size) {
    return 0;
  }
  return value;
}

std::size_t Index(int x, int y, int size) {
  return static_cast<std::size_t>((Wrap(y, size) * size + Wrap(x, size)) * kStride);
}

float HashNoise(int x, int y, std::uint32_t frame) {
  const auto dot = static_cast<float>(x) * 12.9898F + static_cast<float>(y) * 78.233F +
                   static_cast<float>(frame) * 0.173F;
  return std::sin(dot) * 43758.5453F - std::floor(std::sin(dot) * 43758.5453F);
}

}  // namespace

PhaseFieldReference::PhaseFieldReference(Settings settings) { Reset(settings); }

void PhaseFieldReference::Reset(Settings settings) {
  settings_ = settings;
  field_.assign(static_cast<std::size_t>(settings.size * settings.size * kStride), 0.0F);
  next_ = field_;
  frame_ = 0;

  const auto center = static_cast<float>(settings.size - 1) * 0.5F;
  for (int y = 0; y < settings.size; ++y) {
    for (int x = 0; x < settings.size; ++x) {
      const auto idx = Index(x, y, settings.size);
      const auto dx = static_cast<float>(x) - center;
      const auto dy = static_cast<float>(y) - center;
      const auto distance = std::sqrt(dx * dx + dy * dy);
      const auto seed = distance <= settings.seedRadius
                            ? 1.0F
                            : std::max(0.0F, 1.0F - (distance - settings.seedRadius) / 2.0F);
      field_[idx] = seed;
      field_[idx + 1] = std::max(0.15F, 1.0F - seed * 0.45F);
      field_[idx + 2] = seed > 0.2F ? 1.0F : 0.0F;
    }
  }
}

Metrics PhaseFieldReference::Step() {
  Metrics metrics;

  for (int y = 0; y < settings_.size; ++y) {
    for (int x = 0; x < settings_.size; ++x) {
      const auto idx = Index(x, y, settings_.size);
      const auto left = Index(x - 1, y, settings_.size);
      const auto right = Index(x + 1, y, settings_.size);
      const auto up = Index(x, y - 1, settings_.size);
      const auto down = Index(x, y + 1, settings_.size);

      const auto phase = field_[idx];
      const auto nutrient = field_[idx + 1];
      const auto age = field_[idx + 2];
      const auto lapPhase = field_[left] + field_[right] + field_[up] + field_[down] - phase * 4.0F;
      const auto lapNutrient =
          field_[left + 1] + field_[right + 1] + field_[up + 1] + field_[down + 1] - nutrient * 4.0F;
      const auto gradX = (field_[right] - field_[left]) * 0.5F;
      const auto gradY = (field_[down] - field_[up]) * 0.5F;
      const auto angle = std::atan2(gradY, gradX);
      const auto anis = 1.0F + settings_.anisotropy * std::cos(static_cast<float>(settings_.symmetry) * angle);
      const auto front = phase * (1.0F - phase);
      const auto drive = phase - 0.5F + settings_.undercooling + (nutrient - 0.52F) * 0.72F;
      const auto stochastic = (HashNoise(x, y, frame_) - 0.5F) * settings_.noise * (1.0F - phase);
      const auto delta =
          settings_.dt * settings_.mobility * (anis * lapPhase + front * drive + stochastic);
      const auto nextPhase = Clamp01(phase + delta);
      const auto growth = std::max(0.0F, nextPhase - phase);
      const auto nextNutrient =
          Clamp01(nutrient + settings_.dt * (settings_.diffusion * lapNutrient - growth * 0.42F));

      next_[idx] = nextPhase;
      next_[idx + 1] = nextNutrient;
      next_[idx + 2] = age > 0.0F || nextPhase < 0.18F ? age + nextPhase * 0.03F : static_cast<float>(frame_);
      next_[idx + 3] = 0.0F;

      if (nextPhase > 0.2F) {
        metrics.activeCells += 1;
      }
      metrics.growthRate += growth;
    }
  }

  field_.swap(next_);
  frame_ += 1;
  metrics.coverage =
      static_cast<float>(metrics.activeCells) / static_cast<float>(settings_.size * settings_.size);
  metrics.frame = frame_;
  return metrics;
}

const std::vector<float>& PhaseFieldReference::Field() const { return field_; }

}  // namespace crystal
