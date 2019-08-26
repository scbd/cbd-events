<template>
  <span><a :href="download">{{ symbol }}</a></span>
</template>

<script>
import axios from 'axios'

export default {
  name : 'CalEventDetailsFile',
  props: ['file'],
  data(){
    return{
      symbol  : this.file.symbol,
      id      : this.file._id,
      title   : this.file.title?this.file.title.en:'',
      fullFile: {}
    }
  },
  created(){
    this.getData(this.genFilePath(this.symbol))
      .then((res) => {
        this.fullFile = res.data
      })
  },
  computed: {
    download
  },
  methods: {
    genFilePath,
    genMeetingFromSymbol,
    getData
  }
}
function getData(path, params={}){
  const response = axios.get(path, params)

  return response
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
function genFilePath(){
  return  `${process.env.API}/api/v2016/meetings/${this.genMeetingFromSymbol()}/documents/${this.id}`
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
