import Vue from "vue";
import Vuex from "vuex";
import { ethers } from "ethers";
import MyGame from "../utils/MyGame.json";

Vue.use(Vuex);

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export default new Vuex.Store({
    state: {
        account: null,
        error: null,
        mining: false,
        characterNFT: null,
        characters: [],
        boss: null,
        attackState: null,
        contract_address: "0x35E48E02FD22E3cD4E60f6E9475F6Ab47EC37fE8",
    },
    getters: {
        account: (state) => state.account,
        error: (state) => state.error,
        mining: (state) => state.mining,
        characterNFT: (state) => state.characterNFT,
        characters: (state) => state.characters,
        boss: (state) => state.boss,
        attackState: (state) => state.attackState,
    },
    mutations: {
        setAccount(state, account) {
            state.account = account;
        },
        setError(state, error) {
            state.error = error;
        },
        setMining(state, mining) {
            state.mining = mining;
        },
        setCharacterNFT(state, characterNFT) {
            state.characterNFT = characterNFT;
        },
        setCharacters(state, characters) {
            state.characters = characters;
        },
        setBoss(state, boss) {
            state.boss = boss;
        },
        setAttackState(state, attackState) {
            state.attackState = attackState;
        },
    },
    actions: {
        async connect({ commit, dispatch }, connect) {
            try {
                const { ethereum } = window;
                if (!ethereum) {
                    commit("setError", "Metamask not installed!");
                    return;
                }
                if (!(await dispatch("checkIfConnected")) && connect) {
                    await dispatch("requestAccess");
                }
                await dispatch("checkNetwork");
            } catch (error) {
                console.log(error);
                commit("setError", "Account request refused.");
            }
        },
        async checkNetwork({ commit, dispatch }) {
            let chainId = await ethereum.request({ method: "eth_chainId" });
            const rinkebyChainId = "0x4";
            if (chainId !== rinkebyChainId) {
                if (!(await dispatch("switchNetwork"))) {
                    commit(
                        "setError",
                        "You are not connected to the Rinkeby Test Network!"
                    );
                }
            }
        },
        async switchNetwork() {
            try {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x4" }],
                });
                return 1;
            } catch (switchError) {
                return 0;
            }
        },
        async checkIfConnected({ commit }) {
            const { ethereum } = window;
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length !== 0) {
                commit("setAccount", accounts[0]);
                return 1;
            } else {
                return 0;
            }
        },
        async requestAccess({ commit }) {
            const { ethereum } = window;
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            commit("setAccount", accounts[0]);
        },
        async getCharacters({ state, commit, dispatch }) {
            try {
                const connectedContract = await dispatch("getContract");
                const charactersTxn = await connectedContract.getAllDefaultCharacters();
                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );
                commit("setCharacters", characters);
            } catch (error) {
                console.log(error);
            }
        },
        async getContract({ state }) {
            try {
                const { ethereum } = window;
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(
                    state.contract_address,
                    MyGame.abi,
                    signer
                );
                return connectedContract;
            } catch (error) {
                console.log(error);
                console.log("connected contract not found");
                return null;
            }
        },
    }
});