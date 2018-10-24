import Vue        from 'vue'
import axios      from 'axios'
import AuthIFrame from '../components/AuthIFrame'

// create component programatically
const AuthIFrameClass = Vue.extend(AuthIFrame)


export default {

    install(Vue, options={}){
      let env = options.env || 'production'
      const AuthIFrameInstance = new AuthIFrameClass({
          propsData: { env: env }
      })

      //reactive holder for me
      const vm = new Vue({
        data: {
          me: {}
        }
      })

      //$me available on all componeant instances
      Vue.$me= {
                 get: function () {
                     return vm.me
                 },
                 set: function (value) {
                      for (let prop in value)
                        Vue.set(vm.me,prop,value[prop])
                     return this
                 }
      }
      // add iframe to first available component
      Vue.mixin({
        computed:{
          '$me':() => Vue.$me.get(),
          '$isAdmin':isAdmin,
          '$isStaff':isStaff,
          '$token':()=>AuthIFrameInstance.loaded
        },
        methods:{
          '$hasRole':hasRole
        },
        mounted: function () {
        AuthIFrameInstance.$mount()
          if( !Vue.$AuthIFrame && this.$options.name!=='AuthIFrame' && this.$options.name){
            this.$el.appendChild(AuthIFrameInstance.$el)
            Vue.$AuthIFrame = AuthIFrameInstance.$el
          }
        }
      })

      //create global user && instance user
      AuthIFrameInstance.loaded.then(async (t)=>{
        let me = await getUser(t)
        Vue.nextTick(()=>{
          Vue.$me.set(me)
        })

      }).catch(()=>{
        // eslint-disable-next-line

        Vue.$me.set(anonymous())
      })

      function hasRole (role){
        if(!Vue.$me || !Vue.$me.get().roles) return false
        let me = Vue.$me.get()
        return me.roles.includes(role)
      }
      function isAdmin (){
        if(!Vue.$me || !Vue.$me.get().roles) return false
        let me = Vue.$me.get()
        return me.roles.includes('Administrator')
      }
      function isStaff (){
        if(!Vue.$me || !Vue.$me.get().userGroups) return false
        let me = Vue.$me.get()
        return me.userGroups.includes('SCBD')
      }
    }
}

function anonymous() {
  return {  userID: 1,
            name: 'anonymous',
            email: 'anonymous@domain',
            government: null,
            userGroups: null,
            isAuthenticated: false,
            isOffline: true,
            roles: []
          }
}

function getUser(token) {
  if(Vue.$me && Vue.$me.get().name)
    return Vue.$me.get();

  if(!token)
    return anonymous();

  return axios.get(`${process.env.API}/api/v2013/authentication/user`, { headers: { Authorization: "Ticket " + token } })
         .then((r) => {return r.data})
}
