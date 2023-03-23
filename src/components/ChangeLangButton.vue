<script setup lang="ts">
import { useI18n, type Locale } from 'vue-i18n'

const { t, locale, availableLocales } = useI18n({ useScope: 'global' })

const changelang = () => {
  locale.value =
    availableLocales[
      (availableLocales.indexOf(locale.value as Locale) + 1) % availableLocales.length
    ]
}
</script>

<template>
 <el-tooltip class="box-item" effect="dark" :content="t('tooltips.lang')" placement="top-start">
   <div class="flag" @click="changelang">
    {{ t('flag') }}
  </div>
  </el-tooltip>
</template>

<style scoped>
.flag {
  justify-content: center;
  align-items: center;
  line-height: 2.5em;
}
@media (max-width: 450px) {
  .flag {
    line-height: 1em;
  }
}


</style>