<template>
  <transition name="slide-filter">
    <div :class="[$style.main]" @click.stop="showFilter" >
      <div :class="$style.title">
        {{ $t('filterEventsTitle') }}
        <span :class="$style.pullRight">
          <a href="#" @click.stop="done" >Done</a>
        </span>
      </div>
      <div :class="[$style.filterRow]">
        <div :class="[$style.formGroup]" class="form-group form-group-sm" >
          <input :placeholder="$t('keyWord')" type="input" class="form-control input-sm" v-model="keyWordFilter" @click.stop="" >
        </div>
      </div>
      <hr style="margin-top:0;">
      <div :class="[$style.filterRow]">
        <select v-model="selectedStream" class="form-control input-sm" @click.stop="" >
          <option :value="$t('stream')" selected >
            {{ $t('stream') }}
          </option>
          <option value="official">
            Official
          </option>
          <option value="regional">
            Regional
          </option>
          <option value="contact">
            Contact
          </option>
          <option value="hls">
            High Level Segment
          </option>
          <option value="side-events">
            Side-events
          </option>
          <option value="side-events-cbd">
            Side-events SCBD
          </option>
          <option value="events-cbd">
            Events SCBD
          </option>
        </select>
      </div>
      <hr style="margin-top:0;">
      <div :class="[$style.filterRow]" v-if="false" >
        <select v-model="selectedProgramme" class="form-control input-sm" @click.stop="" >
          <option :value="$t('programme')" selected >
            {{ $t('programme') }}
          </option>
          <optgroup :label="programme.title" v-for="programme in programmes" :key="programme.identifier" >
            <option :value="child.identifier" v-for="child in programme.children" :key="child.identifier" >
              {{ child.title }}
            </option>
          </optgroup>
        </select>
      </div>
      <hr style="margin-top:0;">
      <div :class="[$style.filterRow]" v-if="false" >
        <select v-model="selectedAgendaItem" class="form-control input-sm" @click.stop="" >
          <option :value="$t('agendaItem')" selected >
            {{ $t('agendaItem') }}
          </option>
          <option :key="agenda" v-for="agenda in agendaItems" :value="agenda" >
            {{ agenda }}
          </option>
        </select>
      </div>
      <hr style="margin-top:0;" v-if="false" >
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { $fetch } from 'ofetch'
import { useBus } from '~/composables/use-bus'

const props = defineProps(['event'])

const { t, locale: i18nLocale } = useI18n()
const config = useRuntimeConfig()
const bus = useBus()

const keyWordFilter          = ref('')
const showStreamDropdown     = ref(false)
const showSubjectDropdown    = ref(false)
const showAgendaItemDropdown = ref(false)
const selectedStream         = ref(t('stream'))
const selectedProgramme      = ref(t('programme'))
const selectedAgendaItem     = ref(t('agendaItem'))
const streams                = ref([])
const agendaItems            = ref([])
const programmes             = ref([])

function done(e) {
  e.data = {
    show              : false,
    keyWordFilter     : keyWordFilter.value,
    selectedAgendaItem: (selectedAgendaItem.value !== t('agendaItem')) ? selectedAgendaItem.value : '',
    selectedProgramme : (selectedProgramme.value !== t('programme')) ? selectedProgramme.value : '',
    selectedStream    : (selectedStream.value !== t('stream')) ? selectedStream.value : ''
  }
  bus.emit('showFilter', e)
}

function showFilter(e) {
  e.data = false
  bus.emit('showFilter', e)
}

function toggleStream() {
  showStreamDropdown.value = !showStreamDropdown.value
}

async function getPrograms() {
  const endPoint = `${config.public.api}/api/v2013/thesaurus/domains/CBD-SUBJECTS/terms`
  return $fetch(endPoint)
}

function mapPrograms(progs) {
  const parents = []
  const map = {}

  for (let i = 0; i < progs.length; i++)
    map[progs[i].identifier] = progs[i]

  for (let i = 0; i < progs.length; i++)
    if (!progs[i].broaderTerms.length) {
      parents.push(progs[i])
      if (progs[i].narrowerTerms.length)
        if (!progs[i].children) progs[i].children = []
      for (let j = 0; j < progs[i].narrowerTerms.length; j++)
        progs[i].children.push(map[progs[i].narrowerTerms[j]])
    }
  return parents
}

function sanitizeResult(docs, locale = 'en') {
  for (let i = 0; i < docs.length; i++)
    for (const variable in docs[i])
      if (['title'].includes(variable))
        docs[i][variable] = docs[i][variable][locale]
  return docs
}

// created logic
getPrograms().then((data) => {
  const progs = mapPrograms(sanitizeResult(data, i18nLocale.value))
  programmes.value = progs.filter(p => p)
})
</script>
<style>

  .slide-filter-leave-active, .slide-filter-enter-active  {
    transition: all .4s ease;
  }
  .slide-filter-enter {
    transform: translateY(100%);
    opacity: 0;
  }
  .slide-filter-leave-to {
    transform: translateY(200%);
    opacity: 0;
  }
</style>
<style module>

  .filterRow{
    padding: 5px 15px 5px 15px;

  }
  .title {
    font-size: 1.2em;
    padding: 3px 15px 3px 15px;
    color:white;
    /* Fallback (could use .jpg/.png alternatively) */
    background-color: #333333;
    background: #333333; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(left top, #555, #333333); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(bottom right, #555, #333333); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(bottom right, #555, #333333); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to bottom right, #555, #333333); /* Standard syntax (must be last) */

  }
  .formGroup{
    margin-bottom:0;
  }
  .main {
    white-space: normal;
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
    background-color: #fff;
    z-index: 20;
    overflow-y: auto;
  }
    .pullRight { float: right; margin:0 0 0 0; }
</style>
