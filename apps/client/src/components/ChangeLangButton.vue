<script lang="ts" setup>
  import { type Locale, useI18n } from 'vue-i18n'

  const { t, locale, availableLocales } = useI18n({ useScope: 'global' })

  const changelang = () => {
    locale.value =
      availableLocales[
        (availableLocales.indexOf(locale.value as Locale) + 1) % availableLocales.length
      ]
  }
</script>

<template>
  <el-tooltip :content="t('tooltips.lang')" class="box-item" effect="dark" placement="top-start">
    <div class="flag" @click="changelang">
      {{ t('flag') }}
    </div>
  </el-tooltip>
</template>

<style scoped>
  .flag {
    padding: 0 5px;
  }
</style>
