<template>
  <div class="arena-container">
    <div class="boss-container" v-if="boss">
      <div :class="`boss-content ${attackState}`">
        <h2>🔥 {{ boss.name }} 🔥</h2>
        <div class="image-content">
          <img :src="boss.imageURI" :alt="`Boss ${boss.name}`" />
          <div class="health-bar">
            <progress :value="boss.hp" :max="boss.maxHp" />
            <p>{{ `${boss.hp} / ${boss.maxHp} HP` }}</p>
          </div>
        </div>
      </div>
      <div class="attack-container">
        <button class="cta-button" @click="attackAction">
          {{ `💥 Attack ${boss.name}` }}
        </button>
        <div class="loading-indicator" v-if="attackState === 'attacking'">
          <LoadingIndicator />
          <p>Attacking ⚔️</p>
        </div>
      </div>
    </div>
    <div class="players-container" v-if="characterNFT">
      <div class="player-container">
        <h2>Your Character</h2>
        <div class="player">
          <div class="image-content">
            <h2>{{ characterNFT.name }}</h2>
            <img
              :src="characterNFT.imageURI"
              :alt="`Character
            ${characterNFT.name}`"
            />
            <div class="health-bar">
              <progress :value="characterNFT.hp" :max="characterNFT.maxHp" />
              <p>{{ `${characterNFT.hp} / ${characterNFT.maxHp} HP` }}</p>
            </div>
          </div>
          <div class="stats">
            <h4>{{ `⚔️ Attack Damage: ${characterNFT.attackDamage}` }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingIndicator from "./LoadingIndicator.vue";
export default {
  components: {
    LoadingIndicator,
  },
  methods: {
    async attackAction() {
      await this.$store.dispatch("attackBoss");
    },
  },
  async mounted() {
    await this.$store.dispatch("fetchBoss");
  },
  computed: {
    boss() {
      return this.$store.getters.boss;
    },
    characterNFT() {
      return this.$store.getters.characterNFT;
    },
    attackState() {
      return this.$store.getters.attackState;
    },
  },
};
</script>