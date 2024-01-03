<script setup lang="ts">
  import { useRoomStore } from '../store/room.ts'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import GameCard from '../components/GameCard.vue'
  import { RefreshLeft, View, Hide } from '@element-plus/icons-vue'
  import { useI18n } from 'vue-i18n'
  import RoomTimer from '../components/RoomTimer.vue'
  import RoomSettings from '../components/RoomSettings.vue'

  const { t } = useI18n({ useScope: 'global' })

  const props = defineProps<{
    roomId: string
  }>()

  document.title = 'PP - ' + props.roomId

  const roomStore = useRoomStore()
  const { room, users, selectedCard, userName, actionsAllowed } = storeToRefs(roomStore)
  const { joinRoom, vote, show, hide, reset } = roomStore

  joinRoom(props.roomId)

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
  function pickCard(val: string) {
    if (selectedCard.value === val) {
      return false
    }

    if (!selectedCard.value || !val) {
      vote(val)
      return
    }

    vote(null)
    setTimeout(() => vote(val), 200)
  }
</script>

<template>
  <el-row class="actions" justify="end">
    <RoomSettings />
    <RoomTimer class="timer" />
    <el-button
      link
      class="icon-button"
      :underline="false"
      :disabled="!actionsAllowed"
      @click="() => (showHide = !showHide)"
    >
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
    </el-button>
    <el-button
      link
      class="icon-button"
      :underline="false"
      :disabled="!actionsAllowed"
      @click="() => reset()"
    >
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="t('tooltips.reset')"
        placement="top-start"
      >
        <el-icon size="25"><RefreshLeft /></el-icon>
      </el-tooltip>
    </el-button>
  </el-row>
  <div class="user-view">
    <el-row justify="center" :gutter="15">
      <el-col
        v-for="(user, index) in users"
        :key="index"
        :span="4"
        :class="{ cardcontainer: true }"
      >
        <GameCard
          style="font-size: xxx-large"
          :card-value="user.card"
          :class="{
            unset: !user.card,
            mine: userName === user.name,
            actionable: userName === user.name && user.card
          }"
          @click="() => (userName === user.name ? vote(null) : () => {})"
        />
        {{ user.name }}
      </el-col>
    </el-row>
  </div>
  <Teleport to="footer">
    <div class="card-footer">
      <el-row justify="center" style="font-size: xx-large">
        <el-col
          v-for="(val, index) in room.cards"
          :key="index"
          :span="3"
          :class="{ cardcontainer: true }"
        >
          <GameCard
            :card-value="val"
            :class="{
              selected: selectedCard === val,
              actionable: selectedCard !== val
            }"
            @click="() => pickCard(val)"
          />
        </el-col>
      </el-row>
    </div>
  </Teleport>
</template>

<style scoped>
  .actions {
    align-items: center;
  }
  .timer {
    padding: 0px 6px;
  }
  .actionable {
    cursor: pointer;
    transform: scale(1);
    z-index: 5;
  }
  .actionable:hover {
    /* effect like taking the card */
    transform: scale(1.1) rotateX(-5deg) translateY(-20px);
    box-shadow: 0 -5px 5px 5px #0008;
    z-index: 10;
  }
  .mine.actionable:hover {
    /* effect like pulling the card */
    transform: rotateX(5deg) translateY(20px);
  }
  .selected {
    opacity: 0;
    transform: translateY(-200px) rotateX(-10deg) scale(1.3);
    box-shadow: 0 -15px 15px 15px #0000;
  }
  .unset {
    opacity: 0;
    transform: translateY(200px) rotateX(-20deg) scale(1.5);
    box-shadow: 0 -15px 15px 15px #0000;
  }
  .unset:not(.mine) {
    transform: translateY(-200px) rotateX(20deg);
  }
  .user-view {
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    max-width: 1000px;
    margin: 0 auto;
  }
  .cardcontainer {
    perspective: 200px;
    z-index: 5;
    background-color: #0002;
    border-radius: 0.5em;
    margin: 2px;
  }
  .cardcontainer:hover {
    z-index: 9;
  }
  .card-footer {
    position: fixed;
    bottom: 5px;
    right: 5px;
    left: 5px;
    max-width: 800px;
    margin: 0 auto;
  }
  .card-footer .cardcontainer {
    max-width: calc(100% / v-bind('room.cards?.length') - 5px);
  }
</style>
