<template>
  <iframe style="display:none;" ref="authFrame"
          :src="`${accountsBaseUrl}/app/authorize.html`">
  </iframe>
</template>

<script>
  let token = null
  let baseUrl = 'https://accounts.cbddev.xyz'
  export default {
    name: 'AuthIFrame',
    props:['env'],
    data:function(){
      return{
        token:''
    }},
    methods:{
      loadedTimeout:loadedTimeout
    },
    computed:{
      accountsBaseUrl:accountsBaseUrl,
      // receiveMessage:receiveMessage,
      loaded:loaded
    },
    mounted:function(){
      if (typeof window !== 'undefined')
        window.addEventListener('message', receiveMessage)
      if(!this.$refs || !this.$refs.authFrame) return
      this.$refs.authFrame.onload = () => {
        this.$refs.authFrame.contentWindow.postMessage(JSON.stringify({ type : 'getAuthenticationToken' }), this.accountsBaseUrl);
      }

    }

  }

  function loaded(){
    return new Promise(this.loadedTimeout).then((t)=>{
      if (typeof window !== 'undefined')
      window.removeEventListener('message', receiveMessage)
      return t
    }).catch((e)=>console.info(e))
  }

  function loadedTimeout(resolve, reject){
    let timeout,timer =null
    timeout = setTimeout(()=>{
                                clearInterval(timer)
                                return reject(' ')//Error: timeout - cannot read token from cookie after 1 second
                              },1000)
    timer = setInterval(()=>{
                              if(token) {
                                resolve(token)
                                clearInterval(timer)
                                clearTimeout(timeout)
                              }
                            })

  }

  function accountsBaseUrl(){

    if(this.env==='development')
      return baseUrl = 'https://accounts.cbddev.xyz'

    if(this.env==='staging')
      return baseUrl = 'https://accounts.staging.cbd.int'

    // if(this.env==='production')
    //   return baseUrl = 'https://accounts.cbd.int'

    return baseUrl = 'https://accounts.cbddev.xyz'
  }

  function receiveMessage(event)
  {
    if(event.origin!=baseUrl)
      return;

    let message = JSON.parse(event.data)

    if(message.type==='authenticationToken') {
      token= message.authenticationToken
      return token
    }
    else {
      throw new Error ('unsupported authentication message type');
    }
  }
</script>
