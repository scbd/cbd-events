<template>
  <section>
    <Icon name="cog" is-text="true"/>
    <transition name="test">
      <div class="side-menu" v-if="isOpen" >
        <div style="position:relative; text-align: right;">
          <Icon  name="close"/>
        </div>

            <h4>{{ $t('settings') }}</h4>
            

            <div class="list-group">
              <nuxt-link :to="localePath({name:'conferenceCode-conferences', params: { conferenceCode: conferenceCode } })">
                <button class="list-group-item" >
                  <svg class="icon"><use xlink:href="#icon-transfer" /></svg> {{ switchConference }}
                </button>
              </nuxt-link>
            </div>
            <div class="list-group" @click="deleteAll()" >
              <button type="button" class="list-group-item" >
                <svg class="icon"><use xlink:href="#icon-trash-o" /></svg> {{ deleteAllDownloads }}
              </button>
            </div>
              
            <h4 class="mt-4">{{ $t('contactUs') }}</h4>
            <div class="list-group">
              <a href="tel:1-514-288-2220">
                <button type="button" href="tel:1-514-288-2220" class="list-group-item" >
                <svg class="icon"><use xlink:href="#icon-phone" /></svg>{{ $t('callThe') }} {{ $t('scbd') }} <span class="email">1.514.288.2220</span></button>
              </a>
            </div>
            <div class="list-group">
              <a href="mailto:secretariat@cbd.int">
                <button type="button" class="list-group-item" >
                <svg class="icon"><use xlink:href="#icon-envelope" /></svg>
                  {{ $t('emailThe') }} {{ $t('scbd') }}
                  <span class="email">secretariat@cbd.int</span>
                </button>
              </a>
            </div>
            <div class="list-group">
              <a :href="`mailto:${supportEmail}`">
                <button type="button" class="list-group-item" >
                <svg class="icon"><use xlink:href="#icon-envelope" /></svg>
                  {{ $t('IT Support') }}
                  <span class="email">{{supportEmail}}</span>
                </button>
              </a>
            </div>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name    : 'MainMenu',
  props   : { isOpen: { type: Boolean, default: false } },
  computed: { conference, language, deleteAllDownloads, switchConference, supportEmail },
  methods : { deleteAll },
  data
}

function data ({ $route }){
  const { conferenceCode } = $route.params
  const  deleteing         = false

  return { conferenceCode, deleteing }
}

function supportEmail(){
  const { supportEmail } = this.conference?.apps?.cbdEvents || { supportEmail: 'it@cbd.int'}

  return supportEmail
}

async function deleteAll(){
  this.$store.commit('files/DOWNLOADING')
  await this.$store.dispatch('files/DELETE_ALL')
  this.$store.commit('files/DOWNLOADING')
}

function switchConference   (){ return this.$i18n.t('switchConference') }
function deleteAllDownloads (){ return this.$i18n.t('deleteAllDownloads') }
function language           (){ return this.$i18n.t('language') }
function conference         (){ return this.$store.state.conferences.selected || {} }

</script>

<style scoped>
section{display:inline-block;}
.icon{margin-bottom:7px; margin-right:7px;}
.icon-cog{margin-bottom:7px;}
.email{ color:#337ab7; float:right; }
.logo{ max-height: 1.3em; }
 h1{ margin: 1em 1em 1em 1em; }
.list-group-item{ font-size: 1em; width:100%; text-align:left; }
.side-menu{ position:absolute; top:30px; left:1px; height:100vh; width:99vw; background-color: #eee; }
.test-enter-active { transition: all .2s ease; }
.test-leave-active { transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0); }
.test-enter { transform: translatex(100vw); opacity: 0; }
.test-leave-to { transform: translatex(100vw); opacity: 0; }
.active{ color:#337ab7; }

.pullRight { float: right; margin:0 0 0 0; }
</style>
