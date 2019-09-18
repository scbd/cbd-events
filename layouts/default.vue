<template>
  <div>
    <Icons />
    <Header />
    <main class="main-view">
      <nuxt />
    </main>
    <Nav />
  </div>
</template>

<script>
import Header from '~/components/header/header'
import Nav    from '~/components/navigation/index'

export default {
  name      : 'Default',
  components: { Header, Nav },
  methods   : { toggleConnection },
  beforeMount,
  mounted
}
function mounted(){ 
  codePush.getCurrentPackage(function (update) {
    if (!update) {
        console.log("No updates have been installed");
        return;
    }

    // If the current app "session" represents the first time
    // this update has run, and it had a description provided
    // with it upon release, let's show it to the end user
    if (update.isFirstRun && update.description) {
        // Display a "what's new?" modal
    }
});
codePush.checkForUpdate(function (update) {
    if (!update) {
        console.log("The app is up to date.");
    } else {
        console.log("An update is available! Should we download it?");
    }
})
  window.codePush.sync(status ,{
   updateDialog: {
    appendReleaseDescription: true,
    descriptionPrefix: "\n\nChange log:\n"
   },
   installMode: InstallMode.IMMEDIATE
},onProgress,syncError)
  // window.codePush.sync(status, { updateDialog: true, installMode: InstallMode.IMMEDIATE })
  
  //   window.addEventListener('resume', () =>{
  //   window.codePush.sync(status, { updateDialog: true, installMode: InstallMode.IMMEDIATE })
  // })

}

function beforeMount(){
  if(process.server) return
  window.addEventListener('online', this.toggleConnection)
  window.addEventListener('offline', this.toggleConnection)
  this.$store.commit('offLine/SET', window.navigator.onLine)

}
var onProgress = function (downloadProgress) {
    console.log("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress.totalBytes + " bytes.");
};
function status(stat){
  console.log('status update'.stat)
}
function syncError(e){
  console.log('error',e)
}
function toggleConnection(){ this.$store.commit('offLine/TOGGLE') }
</script>
