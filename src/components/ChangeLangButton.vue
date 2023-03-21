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
  <div class="flag" @click="changelang">
    {{ t('flag') }}
  </div>
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