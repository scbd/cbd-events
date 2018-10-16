<template>
  <span ><a :href="download">{{symbol}}</a></span>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CalEventDetailsFile',
  props:['file'],
  data:function(){
    return{
      symbol: this.file.symbol,
      id: this.file._id,
      title:this.file.title?this.file.title.en:'',
      fullFile:{}
    }
  },
  created: function(){
    this.getData(this.genFilePath(this.symbol))
      .then((res)=>{
        this.fullFile = res.data
      })
  },
  computed:{
    download:download
  },
  methods:{
    genFilePath:genFilePath,
    genMeetingFromSymbol:genMeetingFromSymbol,
    getData:getData
  },
}
function getData(path, params={}){
  let response = axios.get(path,params)
  return response
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
function genFilePath(){
  return  `/api/v2016/meetings/${this.genMeetingFromSymbol()}/documents/${this.id}`
}

</script>

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
