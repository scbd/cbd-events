<style module>
  .badge {
    display: inline-block;
    min-width: 45px;
    padding: .3em .6em .3em .6em;
    font-size: .75em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
    line-height: 1em;
    background-color: seagreen;
    cursor:pointer;
  }
  .workflow { background-color: gray;}
</style>

<template>
  <span>
    <a
      @click.stop="goTo(`https://www.cbd.int/meetings/${genMeetingFromSymbol()}/documents/status`)"
      target="_blank"
    ><span
      :class="[$style.badge]"
      v-if="!fullFile.workflow"
    >public</span></a>
    <a
      @click.stop="goTo(`https://www.cbd.int/meetings/${genMeetingFromSymbol()}/documents/status`)"
      target="_blank"
    ><span
      :class="[$style.badge,$style.workflow]"
      v-if="fullFile.workflow"
    >{{ getWorkflow }}</span></a>
  </span>
</template>

<script>
import axios from 'axios'
import querystring from 'querystring'

export default {
  name : 'CalEventDetailsFileStatus',
  props: [ 'file' ],
  data(){
    return{
      symbol  : this.file.symbol,
      id      : this.file._id,
      title   : this.file.title?this.file.title.en:'',
      fullFile: {}
    }
  },
  computed: {
    download,
    getWorkflow
  },
  methods: {
    genFilesFields,
    genFilesQuery,
    genFilesParams,
    genFilePath,
    get,
    genMeetingFromSymbol,
    goTo
  },
  created(){
    this.get(this.genFilePath(this.symbol))
      .then((res) => {
        this.fullFile = res.data
      })
  }
}
function goTo(url){
  if(typeof window !== 'undefined')
    window.open(url, '_blank')
}

function getWorkflow(){
  if(!this.fullFile) return false
  if(this.fullFile.workflow && this.fullFile.workflow.steps){
    const step = this.fullFile.workflow.steps.find((s) => s.status==='active')

    return step.status
  }
}

function download(){
  if(!this.fullFile.files) return '#'
  const file = this.fullFile.files.find((f) => ((f.language === 'en' && f.type === 'application/msword') ||
                (f.language === 'en' && f.type === 'application/pdf'))
  )

  return file.url
}

function genMeetingFromSymbol(){
  if (!this.symbol) return false
  const symbolArr = this.symbol.split('/')

  return `${symbolArr[1]}-${symbolArr[2]}`
}

function genFilesFields(){
  return { symbol: 1, id: 1 }
}

function genFilesQuery(){
  return { type: 'official' }
}

function genFilePath(){
  return  `${process.env.NUXT_ENV_API}/api/v2016/meetings/${this.genMeetingFromSymbol()}/documents/${this.id}`
}

function genFilesParams(){
  return querystring.stringify(
    {
      params: {
        q: this.genFilesQuery(),
        f: this.genFilesFields()
      }
    }
  )
}

function get(path, params={}){
  const response = axios.get(path, params)

  return response
}
</script>
