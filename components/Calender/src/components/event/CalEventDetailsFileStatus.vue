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
      <a v-on:click.stop="goTo(`https://www.cbd.int/meetings/${genMeetingFromSymbol()}/documents/status`)"  target="_blank"><span :class="[$style.badge]" v-if="!fullFile.workflow">public</span></a>
      <a v-on:click.stop="goTo(`https://www.cbd.int/meetings/${genMeetingFromSymbol()}/documents/status`)"  target="_blank"><span :class="[$style.badge,$style.workflow]" v-if="fullFile.workflow">{{getWorkflow}}</span></a>
    </span>
</template>

<script>
import axios from 'axios'
import querystring from 'querystring'

export default {
  name: 'CalEventDetailsFileStatus',
  props:['file'],
  data:function(){
    return{
      symbol: this.file.symbol,
      id: this.file._id,
      title:this.file.title?this.file.title.en:'',
      fullFile:{}
    }
  },
  computed:{
    download:download,
    getWorkflow:getWorkflow
  },
  methods:{
    genFilesFields:genFilesFields,
    genFilesQuery:genFilesQuery,
    genFilesParams:genFilesParams,
    genFilePath:genFilePath,
    get:get,
    genMeetingFromSymbol:genMeetingFromSymbol,
    goTo:goTo
  },
  created: function(){
    this.get(this.genFilePath(this.symbol))
      .then((res)=>{
        this.fullFile = res.data
      })
  }
}
  function goTo(url){
    if(typeof window !== 'undefined')
      window.open(url,'_blank')
  }

  function getWorkflow(){
    if(!this.fullFile) return false
    if(this.fullFile.workflow && this.fullFile.workflow.steps){
      let step = this.fullFile.workflow.steps.find((s)=> {return s.status==='active'})
      return step.status
    }
  }

  function download(){
    if(!this.fullFile.files) return '#'
    let file = this.fullFile.files.find((f)=>
      {
        return ((f.language === 'en' && f.type === 'application/msword') ||
                (f.language === 'en' && f.type === 'application/pdf'))
      }
    )
    return file.url
  }

  function genMeetingFromSymbol(){
    if (!this.symbol) return false
    let symbolArr = this.symbol.split('/')
    return `${symbolArr[1]}-${symbolArr[2]}`
  }

  function genFilesFields(){
    return {symbol:1,id:1}
  }

  function genFilesQuery(){
    return {type:'official'}
  }

  function genFilePath(){
    return  `/api/v2016/meetings/${this.genMeetingFromSymbol()}/documents/${this.id}`
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
    let response = axios.get(path,params)
    return response
  }
</script>
