<script setup lang="ts">
import { useRoomStore } from '@/stores'
import { watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import GameCard from '@/components/GameCard.vue'
import { RefreshLeft, View, Hide } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import RoomTimer from '@/components/RoomTimer.vue'

const { t } = useI18n({ useScope: 'global' })

const props = defineProps<{
  roomId: string
}>()

document.title = 'PP - ' + props.roomId

const roomStore = useRoomStore()
const { room, users, selectedCard, userName } = storeToRefs(roomStore)
const { joinRoom, vote, show, hide, reset } = roomStore

if (props.roomId != room.value.id) {
  if (userName.value) {
    joinRoom(props.roomId)
  }
  watch(
    () => userName.value,
    (newUser) => {
      if (newUser !== '') {
        joinRoom(props.roomId)
      }
    }
  )
}
const showHide = computed({
  get() {
    return room.value.cardVisible
  },
  set(newValue: boolean) {
    if (newValue) {
      show()
    } else {
      hide()
    }
  }
})
</script>

<template>
    <el-row justify="end">
      <RoomTimer class="timer"/>
      <div class="icon-button" :underline="false" @click="() => (showHide = !showHide)">
        <el-icon size="25">
          <el-tooltip
            v-if="!showHide"
            class="box-item"
            effect="dark"
            :content="t('tooltips.show')"
            placement="top-start"
          >
            <View />
          </el-tooltip>
          <el-tooltip
            v-else
            class="box-item"
            effect="dark"
            :content="t('tooltips.hide')"
            placement="top-start"
          >
            <Hide />
          </el-tooltip>
        </el-icon>
      </div>
      <div class="icon-button" :underline="false" @click="() => reset()">
        <el-tooltip class="box-item" effect="dark" :content="t('tooltips.reset')" placement="top-start">
          <el-icon size="25"><RefreshLeft /></el-icon>
        </el-tooltip>
      </div>
    </el-row>
    <div class="user-view" >
      <el-row justify="center" :gutter="15" >
        <el-col :span="4" v-for="(user, index) in users" :key="index">
          <GameCard
            @click="() => (userName === user.name ? vote(null) : () => {})"
            :card-value="user.card"
            :class="{ set: user.card }"
          />
          {{ user.name }}
        </el-col>
      </el-row>
    </div>
  <Teleport to="footer">
    <div class="card-footer" >
      <el-row justify="center">
        <el-col :span="3" v-for="val in ['1', '2', '3', '5', '8', '13', '21', '☕']" :key="val">
          <GameCard
            :card-value="val"
            @click="() => (selectedCard === val ? () => {} : vote(val))"
            :class="{ selected: selectedCard === val }"
          />
        </el-col>
      </el-row>
    </div>
   </Teleport>
</template>

<style scoped>

.icon-button, .timer {
  padding: 0px 6px;
}
.selected {
  opacity: 0;
  transform: translate(0, 0);
  animation-name: moveCard;
  animation-duration: 1s;
}
@keyframes moveCard {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(0, -100px);
  }
}

@keyframes cardSet {
  0% {
    opacity: 0;
    transform: translate(0, 100px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}
.set {
  opacity: 1;
  transform: translate(0, 0);
  animation-name: cardSet;
  animation-duration: 1s;
}
.user-view {
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;

}
.card-footer {
  position: fixed;
  bottom: 5px;
  right: 5px;
  left: 5px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
