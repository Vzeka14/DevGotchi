import { describe, it, expect } from "vitest";
import { decayStats, stageForXp, applyAction, clampStat } from "@/utils/petEngine";
import type { Pet } from "@/types";

describe("clampStat", () => {
  it("clamps values below 0 to 0", () => {
    expect(clampStat(-10)).toBe(0);
  });
  it("clamps values above 100 to 100", () => {
    expect(clampStat(120)).toBe(100);
  });
  it("leaves values in range unchanged", () => {
    expect(clampStat(50)).toBe(50);
  });
});

describe("decayStats", () => {
  it("reduces hunger, energy, happiness by elapsed minutes", () => {
    const stats = { hunger: 80, energy: 80, happiness: 80, skill: 50 };
    const result = decayStats(stats, 300); // 5 minutes
    expect(result.hunger).toBe(77.5);
    expect(result.energy).toBe(77.5);
    expect(result.happiness).toBe(77.5);
  });
  it("does not reduce skill", () => {
    const stats = { hunger: 80, energy: 80, happiness: 80, skill: 50 };
    const result = decayStats(stats, 300);
    expect(result.skill).toBe(50);
  });
  it("does not go below 0", () => {
    const stats = { hunger: 2, energy: 2, happiness: 2, skill: 10 };
    const result = decayStats(stats, 600);
    expect(result.hunger).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.happiness).toBe(0);
  });
});

describe("stageForXp", () => {
  it("returns egg for 0 xp", () => {
    expect(stageForXp(0)).toBe("egg");
  });
  it("returns junior at 50 xp", () => {
    expect(stageForXp(50)).toBe("junior");
  });
  it("returns mid at 200 xp", () => {
    expect(stageForXp(200)).toBe("mid");
  });
  it("returns senior at 500 xp", () => {
    expect(stageForXp(500)).toBe("senior");
  });
  it("returns lead at 1000+ xp", () => {
    expect(stageForXp(1500)).toBe("lead");
  });
});

describe("applyAction", () => {
  const basePet: Pet = {
    id: "test-id",
    name: "Testy",
    stage: "egg",
    stats: { hunger: 50, energy: 50, happiness: 50, skill: 50 },
    xp: 0,
    createdAt: 0,
    lastInteraction: 0,
  };

  it("feed increases hunger", () => {
    const result = applyAction(basePet, "feed");
    expect(result.stats.hunger).toBe(70);
  });

  it("sleep increases energy", () => {
    const result = applyAction(basePet, "sleep");
    expect(result.stats.energy).toBe(75);
  });

  it("code increases skill but decreases energy", () => {
    const result = applyAction(basePet, "code");
    expect(result.stats.skill).toBe(55);
    expect(result.stats.energy).toBe(40);
  });

  it("increments xp by 10", () => {
    const result = applyAction(basePet, "feed");
    expect(result.xp).toBe(10);
  });

  it("updates stage when xp reaches threshold", () => {
    const pet = { ...basePet, xp: 45 };
    const result = applyAction(pet, "feed");
    expect(result.stage).toBe("junior");
  });
});
