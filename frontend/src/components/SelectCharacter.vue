<template>
  <div class="select-character-container">
    <h2 class="mt-5">Mint Your Hero. Choose wisely.</h2>
    <div v-if="characters.length && !minting" class="character-grid">
      <div
        class="character-item cursor-pointer mt-10"
        :key="character.name"
        v-for="(character, index) in characters"
      >
        <div class="name-container">
          <p>{{ character.name }}</p>
        </div>
        <img :src="character.imageURI" :alt="character.name" />
        <button
          type="button"
          class="character-mint-button"
          @click="mintCharacterNFTAction(index)"
        >
          {{ `Mint ${character.name}` }}
        </button>
      </div>
    </div>
    <div class="loading" v-else>
      <div class="indicator">
        <loading-indicator />
        <p>Minting In Progress...</p>
      </div>
      <img
        src="<https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g>"
        alt="Minting loading indicator"
      />
    </div>
  </div>
</template>

<script>
import LoadingIndicator from "./LoadingIndicator.vue";
export default {
  data() {
    return {
      minting: false,
    };
  },
  components: {
    LoadingIndicator,
  },
  methods: {
    async mintCharacterNFTAction(index) {
      if (this.minting) return;
      this.minting = true;
      await this.$store.dispatch("mintCharacterNFT", index);
      this.minting = false;
    },
  },
  async mounted() {
    this.minting = true;
    await this.$store.dispatch("getCharacters");
    this.minting = false;
  },
  computed: {
    characters() {
      return this.$store.getters.characters;
    },
  },
};
</script>