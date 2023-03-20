><script setup lang="ts">
import { useI18n, type Locale } from 'vue-i18n'

const { t, locale, availableLocales } = useI18n({ useScope: 'global' })

const changelang = () => {
  locale.value = availableLocales[(availableLocales.indexOf(locale.value as Locale) + 1) % availableLocales.length]
}


</script> 

<template>
          <div class="flag" @click="changelang">
            {{ t('flag') }}
          </div>
</template>