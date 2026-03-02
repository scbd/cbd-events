<template>
  <transition name="slide-details">
    <div
      :class="[$style.main]"
      @click.stop="showDetails"
    >
      <div :class="$style.title">
        <span
          :class="$style.pointer"
          class="eco-cancel pull-right"
        />
        <span>{{ calEvent.title }} </span>
      </div>
      <div :class="[$style.body]">
        <div class="text-primary" >
          <span class="eco-clock" > {{ dateTime }} </span>
          <!-- <Icon name="calendar-plus" /> -->
        </div>

        <div >
          <span class="eco-calendar-empty" />
          <span
            :key="index"
            :class="$style.caps"
            v-for="(stream, index) in calEvent.stream_ss"
          >{{ stream }}<span v-if="index < calEvent.stream_ss.length-1">,</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>

        <div >
          <span class="eco-location" /> {{ location }}
        </div>
        <div v-if="(organizer || organizerEmail) ">
          <span class="eco-address-card" />
          <a :href="`${organizerEmail}`">{{ organizer || organizerEmail }}</a>
          <div
            :key="i"
            v-for="(o, i) in calEvent.organizers"
          >
            {{ o }}
          </div>
        </div>
        <div v-if="calEvent.item_ss && calEvent.item_ss.length">
          <table>
            <tr>
              <td style="vertical-align:top;">
                <span class="eco-docs" />
              </td>
              <td>
                <table>
                  <tr
                    :key="index"
                    v-for="(item, index) in calEvent.item_ss"
                  >
                    <td>
                      <AgendaItem
                        :body="calEvent.itemMeeting[index]"
                        :item="item"
                      />
                    </td>
                    <td>
                      {{ itemTextArr(index) }}
                    </td>
                    <td>
                      <CalEventDetailsFile
                        v-if="files(index)._id"
                        :file="files(index)"
                      />
                    </td>
                    <td>
                      <FileStatus
                        v-if="files(index)._id"
                        :file="files(index)"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div />
      </div>
      <div :class="$style.footer">
        <span v-html="calEvent.description" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useBus }              from '~/composables/use-bus'
import AgendaItem              from './agenda-item.vue'
import FileStatus              from './cal-event-details-file-status.vue'
import { DateTime }            from 'luxon'
import CalEventDetailsFile     from './cal-event-details-file.vue'

const props = defineProps(['event', 'conference'])
const bus = useBus()

const calEvent = computed(() => props.event || {})

const dateTime = computed(() => {
  const start = DateTime.fromISO(calEvent.value.start, { zone: calEvent.value.timezone }).toFormat('T')
  const end   = DateTime.fromISO(calEvent.value.end, { zone: calEvent.value.timezone }).toFormat('T  cccc, LLLL L ')
  return `${start} - ${end}`
})

const location = computed(() => {
  const localName = calEvent.value.roomLocalName || ''
  const loc       = calEvent.value.roomLocation
  const title     = calEvent.value.roomTitle
  return `${localName}${(loc && localName) ? ',' : ''} ${loc}${title ? ',' : ''} ${title}`
})

const organizer = computed(() => {
  const name  = calEvent.value.organizerName || ''
  let email   = calEvent.value.organizerEmail || ''
  if (email) email = `${name ? '-' : ''} <${email}>`
  if (!email && !name) return false
  return `${name} ${email}`
})

const organizerEmail = computed(() => calEvent.value.organizerEmail || '')

function addToCal() {
  const start = DateTime.fromISO(calEvent.value.start, { zone: calEvent.value.timezone }).toJSDate()
  const end   = DateTime.fromISO(calEvent.value.end, { zone: calEvent.value.timezone }).toJSDate()
}

function addToCalReady() { return props.conference.schedule.addToCalReady }

function goTo(url) {
  if (!import.meta.server) window.open(url, '_blank')
}

function itemTextArr(i) {
  if (calEvent.value.itemText) return calEvent.value.itemText[i]
  return ''
}

function showDetails(e) {
  e.stopPropagation()
  e.data = { data: true }
  bus.emit('EventDetails', e)
}

function files(index) {
  if (!calEvent.value.itemText) calEvent.value.itemText = []
  if (!calEvent.value.item) calEvent.value.item = []
  if (!calEvent.value.itemFiles) calEvent.value.itemFiles = []
  for (let i = 0; i < calEvent.value.itemFiles.length; i++) {
    if (typeof calEvent.value.itemFiles[i] === 'string')
      calEvent.value.itemFiles[i] = JSON.parse(calEvent.value.itemFiles[i])
    if (calEvent.value.itemFiles[i] && calEvent.value.itemFiles[i][0])
      calEvent.value.itemFiles[i] = calEvent.value.itemFiles[i][0]
  }
  return calEvent.value.itemFiles[index] || {}
}

function isInSession() {
  const start = DateTime.fromISO(props.conference.schedule.start)
  const now   = DateTime.local().setZone(props.conference.timezone)
  return start <= now
}
</script>
<style>

  .slide-details-leave-active, .slide-details-enter-active  {
    transition: all .4s ease;
  }
  .slide-details-enter {
    transform: translateY(100%);
    opacity: 0;
  }
  .slide-details-leave-to {
    transform: translateY(200%);
    opacity: 0;
  }
</style>
<style module>
.caps{
  text-transform: capitalize;
}
.pointer{
  cursor:pointer;
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
  .body {
    padding: 5px 15px 5px 15px;
  }
  .footer{
      border-top: 1px solid #eee;
      margin: 0 0 0 0;
      padding: 5px 15px 5px 15px;
  }
  .title {
    /* position: absolute;
    top:0;
    left:0;
    right:0; */
    font-size: 1.2em;
    padding: 3px 15px 3px 15px;


    color:white;
    /* Fallback (could use .jpg/.png alternatively) */
    background-color: #009b48;

    background: #009b48; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(left top, #008200, #009b48); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(bottom right, #008200, #009b48); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(bottom right, #008200, #009b48); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to bottom right, #008200, #009b48); /* Standard syntax (must be last) */

  }
    .titleCont{
      background-color: #009b48;
      color:white;
    }
</style>
