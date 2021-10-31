<template>
  <div class="error">

    <div class="top">
        <div class="top__item">
          <h1>Такой страницы не существует</h1>
        </div>
    </div>

  </div>
</template>

<script lang="ts">

interface Iobject {
  [key: string]: any
}

export default {
  name: 'Error',
} as Iobject
</script>
