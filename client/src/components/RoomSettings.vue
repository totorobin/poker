<script setup lang="ts">
import {useRoomStore} from '../store/room.ts'
import {Setting} from '@element-plus/icons-vue'
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n({useScope: 'global'})

  const dialogFormVisible = ref(false)

  const roomStore = useRoomStore()

  const cards = ref('')
  const selectedCards = computed(() => cards.value.split(';'))
  const actionsOwnerOnly = ref(false)
  const noVoteWhenVisible = ref(false)

  const openDialog = () => {
    cards.value = roomStore.room?.cards?.join(';')
    currentList.value = selectedCards.value
    dialogFormVisible.value = true
    actionsOwnerOnly.value = roomStore.room?.actionsOwnerOnly
    noVoteWhenVisible.value = roomStore.room?.noVoteWhenVisible
  }
  const updateSettings = () => {
    roomStore.updateSettings({
      id: roomStore.room.id,
      cards: selectedCards.value.map((a) => a.trim()).filter((a) => a.length > 0),
      owner: roomStore.room.owner,
      actionsOwnerOnly: actionsOwnerOnly.value,
      noVoteWhenVisible: noVoteWhenVisible.value
    })
    dialogFormVisible.value = false
  }
  const currentList = ref<string[]>([])
  const cardsSets = [
    { name: 'settings.sets.fibo1', values: '0,5;1;2;3;5;8;13;21;30;50;100;∞;?;☕' },
    { name: 'settings.sets.line', values: '0;1;2;3;4;5;6;7;8;9;10' },
    { name: 'settings.sets.fibo2', values: '0;1;2;3;5;8;13;21;34;55;89;144' },
    { name: 'settings.sets.tee-shirt', values: 'xs;s;m;l;xl;?;☕' },
    { name: 'settings.sets.weather', values: '☀;🌤;🌥;🌦;🌧;⛈;🌨' }
  ]

  const selectList = () => {
    cards.value = currentList.value.join(';')
  }
  const selectCard = (val: string) => {
    if (selectedCards.value.includes(val)) {
      cards.value = selectedCards.value.filter((v) => v !== val).join(';')
    } else {
      const desorderedList = [...selectedCards.value, val]
      cards.value = currentList.value.filter((v: string) => desorderedList.includes(v)).join(';')
    }
  }
</script>

<template>
  <el-button
    v-if="roomStore.userUuid === roomStore.room.owner"
    link
    class="icon-button"
    :underline="false"
    @click="openDialog"
  >
    <el-icon size="25">
      <Setting />
    </el-icon>
  </el-button>

  <el-dialog v-model="dialogFormVisible" :title="t('settings.form.title')">
    <el-row>
      <el-col :span="5">{{ t('settings.form.deck') }}</el-col>
      <el-col :span="6">
        <select v-model="currentList" @change="selectList">
          <option :value="[]" disabled selected></option>
          <option v-for="(set, index) in cardsSets" :key="index" :value="set.values.split(';')">
            {{ t(set.name) }}
          </option>
        </select>
      </el-col>
    </el-row>

    <div v-if="currentList.length != 0">
      <el-row class="list">
        <el-col v-for="(val, index) in currentList" :key="index" :span="2">
          <GameCard
            :card-value="val"
            :class="{ cardSelected: selectedCards.includes(val) }"
            @click="selectCard(val)"
          />
        </el-col>
      </el-row>
    </div>
    <el-input v-model="cards" placeholder="list of cards" />
    <p>{{ t('settings.form.actions-owner-only') }} <el-switch v-model="actionsOwnerOnly" /></p>
    <p>{{ t('settings.form.no-vote-after-show') }} <el-switch v-model="noVoteWhenVisible" /></p>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ t('buttons.cancel') }}</el-button>
        <el-button type="primary" @click="updateSettings">{{ t('buttons.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
  .list {
    font-size: medium;
    padding-left: 10px;
  }

  .card {
    opacity: 0.3;
    transition: 0.5s ease;
  }

  .cardSelected {
    opacity: 1;
    transition: 0.5s ease;
  }
</style>
