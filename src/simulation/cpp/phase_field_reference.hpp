#pragma once

#include <cstdint>
#include <vector>

namespace crystal {

struct Settings {
  int size = 384;
  float dt = 0.42F;
  float anisotropy = 0.18F;
  float undercooling = 0.29F;
  float mobility = 0.74F;
  float diffusion = 0.24F;
  float noise = 0.018F;
  int symmetry = 6;
  float seedRadius = 5.0F;
};

struct Metrics {
  std::uint32_t activeCells = 0;
  float growthRate = 0.0F;
  float coverage = 0.0F;
  std::uint32_t frame = 0;
};

class PhaseFieldReference {
 public:
  explicit PhaseFieldReference(Settings settings);

  void Reset(Settings settings);
  Metrics Step();
  const std::vector<float>& Field() const;

 private:
  Settings settings_;
  std::vector<float> field_;
  std::vector<float> next_;
  std::uint32_t frame_ = 0;
};

}  // namespace crystal
