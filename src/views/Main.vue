<template>
  <div class="app">
    <div class="left-side noisy">
      <div class="light-bar noisy">

        <div class="primary-lens noisy">
          <div class="bottom-lens"></div>
          <div :class="['inner-lens', isClosed]"></div>
        </div>
        <div class="status-lights">
          <div class="light red"><div v-if="lightStatus.error" class="lit blink"></div></div>
          <div class="light yellow"><div v-if="lightStatus.loading" class="lit blink"></div></div>
          <div class="light green"><div v-if="lightStatus.success" class="lit blink"></div></div>
        </div>

        <div :class="['power-button', isClosed]" @click="toggleCover"><div class="inner"></div></div>

      </div>

      <div class="pokemon-image-window">
        <div class="window">
          <h1 class="" v-if="pokemon==null">No Pokemon Selected</h1>
          <div class="pokemon-screen" v-if="pokemon!=null">
            <div class="left">
              <div :class="['tab',selectedTab(1)]">P</div>
              <div :class="['tab',selectedTab(2)]">S</div>
              <div :class="['tab',selectedTab(3)]">E</div>
              <div :class="['tab',selectedTab(4)]">A</div>
            </div>
            <div class="right">

              <div class="poke-screen" v-if="screen==1">
                <div class="image">
                  <div class="inner" v-if="false" :style="pokemonLargeImage(pokemon.id)"></div>
                  <img :src="pokemonLargeImg(pokemon.id)" style="width: 12rem; height: 12rem;"/>
                </div>
                <div class="title">{{capitalize(pokemon.name)}}</div>
              </div>
              <div class="" v-if="screen==2">
                <div class="upper">

                </div>
                <div class="title">Statistics</div>
              </div>
              <div class="" v-if="screen==3">
                <div class="upper">

                </div>
              <div class="title">Evolutions</div></div>
              <div class="" v-if="screen==4">
                <div class="upper">

                </div>
              <div class="title">Abilities</div></div>

            </div>
          </div>
        </div>
      </div>

      <div class="button-cluster">
        <div class="row">
          <div class="middle"></div>
          <div :class="['arrow-button', 'top']" @click="screenTabDown"><div class="inner"></div></div>
          <div class="middle"></div>
        </div>
        <div class="row">
          <div :class="['arrow-button', 'left']" @click="screenTabUp"><div class="inner"></div></div>
          <div class="middle"></div>
          <div :class="['arrow-button', 'right']" @click="screenTabUp"><div class="inner"></div></div>
        </div>
        <div class="row">
          <div class="middle"></div>
          <div :class="['arrow-button', 'down']" @click="screenTabUp"><div class="inner"></div></div>
          <div class="middle"></div>
        </div>
      </div>
    </div>
    <div class="hinge noisy">
      <div v-for="part in 10" class="hinge-piece"></div>
    </div>
    <div :class="['right-side', isClosed]">

      <div class="light-bar">
        <div class="lens-cutout"></div>
      </div>

      <div class="right-inner noisy">
        <div class="right-inner-rear noisy">
          <div class="logo"></div>
        </div>
      <div class="upper-left-hump"></div>
      <div class="light-bar-rim noisy"></div>

      <div class="menu-cluster">
        <div class="tab" v-if="currentTab=='screensaver'">
          <div class="title">PokeDex v1</div>
        </div>

        <div class="tab" v-if="currentTab=='generations'">
          <div class="header">Search by Generation</div>
          <div class="content">
            <div class="menu-item" v-for="gen in generations" @click="loadGeneration(gen.number)">Generation {{gen.number}}<span>{{`(${gen.pokemonStart} - ${gen.pokemonEnd})`}}</span></div>
          </div>
        </div>

        <div class="tab" v-if="currentTab=='regions'">
          <div class="header">Search by Region</div>
          <div class="content"></div>
        </div>

        <div class="tab" v-if="currentTab=='favourites'">
          <div class="header">My Favourites</div>
          <div class="content"></div>
        </div>

        <div class="tab" v-if="currentTab=='generation'">
          <div class="header">Generation {{this.gen}}</div>
          <div class="content">
            <div v-if="generations[gen-1].pokemon!=null" v-for="pokemon in generations[gen-1].pokemon" class="menu-item pokemon" @click="getPokemonByNumber(pokemon.id)">{{pokemon.id}} - {{capitalize(pokemon.name)}}<div class="img" :style="pokemonSmallImage(pokemon.id)"></div></div>
          </div>
        </div>

      </div>

      <div class="button-cluster">
        <div class="row">
          <button :class="[clusterPressed(1)]" @click="changeTab('generations'), changeClusterButton(1)">Gen<div class="inner"></div></button>
          <button :class="[clusterPressed(2)]" @click="changeTab('regions'), changeClusterButton(2)">Reg<div class="inner"></div></button>
          <button :class="[clusterPressed(3)]" @click="changeTab('favourites'), changeClusterButton(3)">Fav<div class="inner"></div></button>
          <button :class="[clusterPressed(4)]" @click="changeClusterButton(4)">G<div class="inner"></div></button>
          <button :class="[clusterPressed(5)]" @click="changeClusterButton(5)">G<div class="inner"></div></button>
        </div>
        <div class="row">
          <button :class="[clusterPressed(6)]" @click="changeClusterButton(6)">G<div class="inner"></div></button>
          <button :class="[clusterPressed(7)]" @click="changeClusterButton(7)">G<div class="inner"></div></button>
          <button :class="[clusterPressed(8)]" @click="changeClusterButton(8)">G<div class="inner"></div></button>
          <button :class="[clusterPressed(9)]" @click="changeClusterButton(9)">G<div class="inner"></div></button>
          <button :class="[clusterPressed(10)]" @click="changeClusterButton(10)">G<div class="inner"></div></button>
        </div>
      </div>

    </div>
    </div>

  </div>
</template>

<script>

import { gql } from 'graphql-request'

export default {
  name: "App",
  components: {

  },
  data: function(){
    return {
      closed: true,
      selectedClusterButton: 2,
      currentTab: 'screensaver',
      screen: 1,
      lightStatus: {
        loading: false,
        error: false,
        success: false
      },
      screenTabs: [
        {title: 'Pokemon'},
        {title: 'Stats'},
        {title: 'Evolutions'},
        {title: 'Abilities'},
      ],
      generations: [
        {number: 1, pokemonStart: 1, pokemonEnd: 151, pokemon: null},
        {number: 2, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
        {number: 3, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
        {number: 4, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
        {number: 5, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
        {number: 6, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
        {number: 7, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
        {number: 8, pokemonStart: 0, pokemonEnd: 151, pokemon: null},
      ],
      pokemon: {
        name: 'Benysaur',
        id: 3,

      },
      gen: 1,
      generationNames: [
        'generation-i',
        'generation-ii',
        'generation-iii',
        'generation-iv',
        'generation-v',
        'generation-vi',
        'generation-vii',
        'generation-viii',
      ]
    }
  },
  computed: {
    isClosed: function(){
      return (this.closed) ? 'close':'';
    },
  },
  methods: {
    changeClusterButton: function(clusterButton){
      console.log(clusterButton);
      this.selectedClusterButton = clusterButton;
    },
    clusterPressed: function(clusterButton){
      return (clusterButton==this.selectedClusterButton)?'selected':'';
    },
    selectedTab: function(tabId){
      return (tabId==this.screen)?'selectedTab':'';
    },
    changeTab: function(tab){
      this.currentTab = tab;
    },
    resetLights: function(){
      this.lightStatus.success = false;
      this.lightStatus.loading = false;
      this.lightStatus.error = false;
    },
    loadGeneration: function(gen){
      this.lightStatus.loading = true;
      this.currentTab = 'generation';
      this.gen = gen;
      if(this.generations[gen].pokemon==null){
        this.getPokemonByGen(gen);
      }
    },
    getPokemonByGen: async function(gen) {
      const query = `
      query samplePokeAPIquery($name: String) {
      gen1_species: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {name: {_eq: $name}}}, order_by: {id: asc}) {
        name
        id
      }
    }
      `

      let pokeResult = await this.$API.pokeapi(
        query,
        {name: `${this.generationNames[gen-1]}`},
        "samplePokeAPIquery"
      )

      //console.log(pokeResult)
      //console.log(this.generations[gen]);


      this.lightStatus.loading = false;
      this.lightStatus.success = true;
      setTimeout(this.resetLights, 1000);

      this.generations[gen-1].pokemon = pokeResult[Object.keys(pokeResult)[0]];

      console.log('--- Here ---');
    },
    getPokemonByName: async function(name) {
      const query = `
      query samplePokeAPIquery($name: String) {
          gen3_species: pokemon_v2_pokemonspecies(where: {name: {_eq: $name}}) {
            name
            id
          }
        }
      `

      let pokeResult = await this.$API.pokeapi(
        query,
        {name: `${name}`},
        "samplePokeAPIquery"
      )

      console.log(pokeResult)
    },
    getPokemonByNumber: async function(id){
      this.resetLights();
      this.lightStatus.loading = true;
      const query = `
      query samplePokeAPIquery($id: Int) {
          pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
            id
            name
          }
        }
      `

      let pokeResult = await this.$API.pokeapi(
        query,
        {id: parseInt(id)},
        "samplePokeAPIquery"
      )

      console.log(pokeResult)
      this.pokemon = pokeResult[Object.keys(pokeResult)[0]][0];
      this.lightStatus.loading = false;
      this.lightStatus.success = true;
      setTimeout(this.resetLights, 1000);

    },
    capitalize: function(text){
      return text.slice(0,1).toUpperCase()+text.slice(1,text.length);
    },
    pokemonSmallImage: function(id){
      return {background: `transparent url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png) no-repeat`, backgroundSize: '110%', backgroundPosition: 'center'}
    },
    pokemonLargeImage: function(id){
      return {backgroundSize: '90% !important', backgroundPosition: 'center',background: `transparent url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png) no-repeat`}
    },
    pokemonLargeImg: function(id){
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    },
    toggleCover: function(){
      console.log('clicked');
      this.closed = !this.closed;
      this.lightStatus.loading = true;
      this.lightStatus.error = true;
      this.lightStatus.success = true;
      setTimeout(this.resetLights, 500);
    },
    screenTabUp: function(){
      if(this.screen<this.screenTabs.length){
        this.screen++;
      }
    },
    screenTabDown: function(){
      if(this.screen>1){
        this.screen--;
      }
    }
  },
  mounted() {

  }
};
</script>

<style lang="scss">
@import '@/ui/styles/main.scss';

.app {height: 100vh; width: 100vw; overflow: hidden;font-size: 0;}

   .left-side {width: calc(50% - 1rem); height: calc(100vh - 1rem);display: inline-block; vertical-align: top;background-color: rgb(168, 16, 16);
              border-radius: 0.15rem;
              border-top-left-radius: 5rem;overflow: hidden;
              border-bottom-left-radius: 2rem;
              border-bottom-right-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              box-shadow: inset 0 0 4px 2px rgba(#4f0808, 0.68);

    .button-cluster {padding: 2rem;
                    width: calc(100% - 4rem);
                    height: auto;
                    margin: 1rem 2rem;
                    max-width: 13.5rem;
                    height: 13.5rem;
                    padding: 0;

                    > .row {height: 4rem; width: 100%; display: flex;text-align: center;padding: 0;margin-bottom: 0.5rem;
                      > .middle {flex: 1;}

                      > .arrow-button {flex: 1;
                                      background: transparent;
                                      display:inline-block;
                                      height: 4rem;
                                      width: 3rem;
                                      max-width: 1rem;
                                      position:relative;
                                      overflow:hidden;
                                      border-radius: 0.5rem;
                                      padding-right:15px;}

                    > .arrow-button > .inner {
                    content:"";
                    position:absolute;
                    width:3rem;
                    box-shadow: 0px 0px 4px 2px rgba(#ffffff, 0.15);
                    height:3rem;
                    right:0px;
                    top:50%;
                    border: 1px solid #333333;
                    transform: translate(50%, -50%) rotate(45deg);
                    background-color: #c17d14;
                    border-radius: 0.5rem;
                    }
                    > .arrow-button > .inner:hover {background-color: #ebac4c;}
                    > .top {transform: rotate(90deg) scale(2, 1.2);}
                    > .down {transform: rotate(-90deg) scale(2, 1.2);}
                    > .left {transform: rotate(0deg) scale(2, 1.2);}
                    > .right {transform: rotate(180deg) scale(2, 1.2);}
                    }
                  }

    .light-bar {width: 100%;
              height: 8rem;
              border-bottom: 2px solid #520d0d;
              border-bottom-right-radius: 0.35rem;
              border-bottom-left-radius: 0.35rem;
              box-shadow: 0px 0px 8px 2px rgba(#333333, 0.3);
              box-shadow: inset 0 0 4px 2px rgba(#4f0808, 0.68);
              background-color: rgb(195, 15, 15);
              margin-bottom: 2.5rem;
              position: relative;

              > .power-button.close {box-shadow: 0px 0px 4px 2px rgba(#ffffff, 0.1);}
              > .power-button.close > .inner {opacity: 0.9;
                                              background: rgb(71, 149, 67) url('../ui/power.png') no-repeat;
                                              background-size: 80%;
                                              background-position: center;}

              > .power-button {position: absolute;
                              width: 3rem;
                              height: 3rem;
                              top: 2rem;
                              right: 2rem;
                              border-radius: 0.5rem;
                              border: 2px solid #d48d8d;
                              z-index: 100;
                              box-shadow: 0px 0px 8px 4px rgba(#ffffff, 0.3);
                              background: rgb(51, 93, 51);


                              > .inner {margin: 0.25rem;
                                        pointer-events: none;
                                        height: 2.5rem;
                                        width: 2.5rem;
                                        box-shadow: 0px 0px 4px 2px rgb(71, 149, 67);
                                        background: rgb(71, 149, 67) url('../ui/power-light.png') no-repeat;
                                        background-size: 80%;
                                        opacity: 1;
                                        background-position: center;
                                        border-radius: 0.2rem;}
                            }

              > .primary-lens {width: auto;
                              height: auto;
                              margin: 0.5rem;
                              padding: 0.5rem;
                              vertical-align: top;
                              border: 2px solid #520d0d;
                              box-shadow: inset 0px 0px 4px 2px rgba(#ffffff, 0.3);
                              border-radius: 50%;
                              background-color: rgb(204, 18, 18);
                              display: inline-block;

                > .bottom-lens {height: 5rem;
                                width: 5rem;
                                top: calc(2rem + 2px);
                                left: calc(2rem + 2px);
                                position: absolute;
                                background-color: rgb(0, 0, 0);
                                border-radius: 50%;
                                border: 3px solid #cdb6b6;
                                //box-shadow: 0px 0px 4px 2px rgba(#ffffff, 0.3);
                                background: radial-gradient(circle, #567877 0%, #456b77 32%, #094a57 75%, #acf4fe 87%, #3c8e9d 91%, #508d98 94%, #125765 100%);
                              }
                > .inner-lens.close {opacity: 0;}
                > .inner-lens {height: 5rem;
                                width: 5rem;
                                opacity: 1;
                                margin: 1rem;
                                position: relative;
                                background-color: rgb(177, 220, 222);
                                border-radius: 50%;
                                border: 3px solid #b3b3b3;
                                box-shadow: 0px 0px 10px 4px rgba(#ffffff, 0.6);
                                background: rgb(216,255,254);
                                transition: opacity 1s cubic-bezier(1, 0.5, 0, 2.01);
                                background: radial-gradient(circle, rgba(216,255,254,1) 0%, rgba(255,255,255,1) 32%, rgba(38,218,255,1) 75%, rgba(172,244,254,1) 87%, rgba(119,234,254,1) 91%, rgba(165,236,249,1) 94%, rgba(0,212,255,1) 100%);}

              }

              > .status-lights {display: inline-block;
                                vertical-align: top;

                > .light {display: inline-block;
                          vertical-align: top;
                          border-radius: 50%;
                          width: 1rem;
                          height: 1rem;
                          margin: 1rem 0.25rem;
                          border: 1px solid #b0b0b0;

                          position: relative;
                          box-shadow: 0px 0px 2px 1px rgba(#333333, 0.8);}

                > div > .lit {border-radius: 50%;
                              width: 1rem;
                              height: 1rem;
                              border: 1px solid #b0b0b0;
                              position: absolute;
                              top: 0;
                              left: 0;
                              opacity: 0;
                              box-shadow: 0px 0px 15px 2px rgba(#ffffff, 1);}

                > .red {background-color: rgb(117, 49, 49);
                  > .lit {background-color: rgb(226, 36, 36);}
                }
                > .yellow {background-color: rgb(157, 147, 60);
                  > .lit {background-color: rgb(242, 186, 42);}
                }
                > .green {background-color: rgb(70, 102, 68);
                  > .lit {background-color: rgb(96, 214, 88);}
                }

              }
    }


    .pokemon-image-window {background-color: #ffffff;
                        height: auto;
                        width: clamp(20rem, 70%, calc(100% - 5rem));
                        margin: auto;
                        box-shadow: 0px 0px 2px 1px rgba(#333333, 0.5);
                        border-radius: 0.35rem;
                        border-bottom-left-radius: 3rem;
                        padding: 3rem 2rem;


    > .window {width: calc(100%);
              box-shadow: inset 0px 0px 2px 1px rgba(#333333, 0.5);
              min-height: 15rem;
              border-radius: 0.25rem;
              background-color: #e3e3e3;
              border: 1px solid #333333;

              > .pokemon-screen {display: flex;width: 100%;height: 15rem;

                > .left {flex: none; width: 4rem;border-right: 1px solid #c4c0c0;display: flex; flex-direction: column;
                        > .tab {flex: 1; border-bottom: 1px solid #c4c0c0; width: 100%;}
                        > .tab.selectedTab {background-color: #80a5d0;}
                        }
                > .right {flex: 1;
                  > div {font-size: 1rem;display: flex; flex-direction: column;height: 15rem;
                    > .title {border-top: 1px solid #c4c0c0;flex: none; height: 2rem; text-align: center;line-height: 2rem;width: 100%;font-family: $screenFont;}
                    > .upper {flex: 1;width: calc(100% - 1rem); padding: 0.5rem;overflow: hidden;}
                  }
                  > .poke-screen {display: flex; flex-direction: column;height: 15rem;
                    > .title {border-top: 1px solid #c4c0c0;flex: none; height: 2rem; text-align: center;line-height: 2rem;width: 100%;font-family: $screenFont;}
                    > .image {flex: 1;width: calc(100% - 1rem); padding: 0.5rem;overflow: hidden;text-align: center;
                      > img {width: 11rem; height: 11rem;background-size: 90%;}
                      > .inner {width: 11rem; height: 11rem;background-size: 90%;}
                    }
                  }
                    }
              }
            }
  }
}

.hinge {width: 1rem; height: calc(100vh - 1.5rem);display: inline-block; vertical-align: top;margin-top: 0.25rem;
        box-shadow: inset 0px 0px 8px 1px rgba(#333333, 0.8);background-color: rgb(168, 16, 16);border-radius: 0.35rem;

        > .hinge-piece {min-height: 5rem; width: 100%; border-bottom: 1px solid #3b0808;box-shadow: inset 0 0 4px 2px rgba(#4f0808, 0.68);}
        > .hinge-piece:first-child {min-height: 10rem;}
      }

.right-side.close {transform: rotateY(180deg);}
.right-side.close > .right-inner {transform: translate(calc(1rem + 0px));}
.right-side.close > .right-inner > .right-inner-rear {width: 100%;}

.right-side {width: calc(50% - 1rem); height: calc(100vh - 1rem);
            display: inline-block; vertical-align: top;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            transform-origin: center left;
            perspective: 100px;
            transform-style: preserve-3d;





  > .light-bar {width: 100%;
            display: none;
            height: 4rem;
            border-bottom: 2px solid #520d0d;
            //background-color: rgb(0, 0, 0);
            //background-color: rgb(195, 15, 15)rgb(68, 61, 61);
            position: relative;
            pointer-events: none;

            > .lens-cutout {width: auto;
                            height: auto;
                            margin: 0.5rem;
                            padding: 0.5rem;
                            height: 8rem;
                            width: 8rem;
                            right: 0.3rem;
                            position: absolute;
                            vertical-align: top;
                            box-shadow: 0px 0px 4px 2px rgba(#000000, 0.3);
                            border-radius: 50%;
                            background-color: rgb(0,0,0);
                            display: inline-block;}
          }

  > .right-inner {background-color: rgb(168, 16, 16);height: calc(100vh - 10rem - 4px);
                  text-align: center;
                  transition: transform 0.05s;
                  transition-delay: 0.2s;
                  border-bottom-right-radius: 2rem;
                  margin-top: calc(9rem + 4px);
                  position: relative;
                  border-top-right-radius: 0.35rem;
                  border-top-left-radius: 0.35rem;
                  box-shadow: inset 0 0 4px 2px rgba(#4f0808, 0.68);
                  border-bottom-left-radius: 0.5rem;


> .right-inner-rear {
                box-shadow: inset 0 0 4px 2px rgba(#4f0808, 0.68);
                transform: rotateY(180deg);
                background-color: rgb(168, 16, 16);
                //background-color: blue;
                position: absolute;
                top: 0;
                height: calc(100vh - 10rem - 4px);
                width: 0%;
                text-align: center;
                transition: width 100ms;
                transition-delay: 0.2s;
                border-bottom-left-radius: 2rem;
                border-bottom-right-radius: 0.5rem;
                border-top-right-radius: 0.45rem;
                border-top-left-radius: 0.45rem;
                z-index: 10;
                overflow: hidden;
                //margin-top: calc(9rem + 4px);

                .logo {width: calc(100% - 4rem);
                      margin: 5rem 2rem 1rem 2rem;
                      background: transparent url('../ui/pokepad-logo.png') no-repeat;
                      background-size: contain;
                      background-position: center;
                      height: 20rem;}

                .power-button {position: absolute; bottom: 1rem; left: 1rem;}
                }

  > .upper-left-hump {height: 5rem;
    display: none;
                      position: absolute;
                      top: -5rem;
                      width: 10rem;
                      background-color: blue;
                      }

  > .light-bar-rim {width: calc(100% - 0.6rem);
            margin-left: 0.3rem;
            border-bottom-right-radius: 0.35rem;
            border-bottom-left-radius: 0.35rem;
            height: 0.45rem;
            border-bottom: 2px solid #661515;
            box-shadow: 0px 0px 8px 4px rgba(#333333, 0.2);
            background-color: rgb(195, 15, 15);
            margin-bottom: 2rem;}

  > .menu-cluster {border: 1px solid rgb(0, 0, 0);
                    width: 25rem;
                    height: $menuClusterHeight;
                    margin-bottom: 2rem;
                    margin-left: auto;
                    background-color: $screenColorBright;
                    margin-right: auto;
                    border-radius: 0.35rem;
                    box-shadow: 0px 0px 4px 2px rgba(#ffffff, 0.3);
                    display: flex;
                    flex-direction: column;
                    font-family: $screenFont;
                    color: $screenTextColor;
                    overflow: hidden;
                    text-align: left;

                    > .tab {width: 100%;
                            flex: 1;
                            display: flex;
                            flex-direction: column;

                            > .header {flex: none;
                                      height: 3rem;
                                      width: calc(100% - 2rem);
                                      border: 0;
                                      border-bottom: 2px solid $screenTextColor;
                                      border-style:dashed;
                                      line-height: 3.4rem;
                                      font-size: 0.8rem;
                                      padding: 0rem 1rem;}

                            > .content {flex: none;
                                        height: calc(#{$menuClusterHeight} - 3rem - 2px);
                                        width: 100%;
                                        overflow-x: hidden;
                                        overflow-y: scroll;

                                        > .menu-item.pokemon > .img {
                                          filter: grayscale(100%);
                                          width: 3rem;
                                          height: 3rem;
                                          position: absolute;
                                          right: 0.5rem;
                                          top: 0;
                                        }

                                        > .menu-item {width: calc(100% - 1rem);
                                                      line-height: 3rem;
                                                      overflow: hidden;
                                                      height: 3rem;
                                                      font-size: 0.7rem;
                                                      padding: 0rem 0.5rem;
                                                      border-bottom: 1px solid #333333;
                                                      min-height: 3rem;
                                                      position: relative;


                                                      > span {position: absolute;
                                                            right: 0.5rem;
                                                            font-size: 0.6rem;}
                                                    }
                                      }
                            }


                  }

  > .button-cluster {border: 1px solid rgb(0, 0, 0);
                    width: 20rem;
                    margin-left: auto;
                    background-color: rgb(12, 45, 83);
                    margin-right: auto;
                    border-radius: 0.35rem;
                    box-shadow: 0px 0px 4px 2px rgba(#ffffff, 0.3);

              > .row {

                > button:hover {background-color: rgb(2, 154, 201);}
                > button.selected {background-color: rgb(2, 154, 201);box-shadow: 0px 0px 15px 2px rgba(#ffffff, 0.5);z-index: 2;}
                > button {min-width: 4rem;
                          user-select: none;
                          height: 4rem;
                          border-radius: 0.25rem;
                          border: 0.05rem solid rgb(7, 41, 59);
                          background-color: rgb(0, 109, 143);
                          margin: 0;
                          position: relative;

                          > .inner {width: 3.5rem;height: 3.5rem; background-color: #ffffff;opacity: 0.08; position: absolute; top: 0.25rem; left: 0.25rem;border-radius: 0.35rem;}
                        }
              }
            }
    }
}
</style>
