<template>
    <div class="footer" v-if="true">
        <div class="footer-center">
            <div class="footer__right"></div>
            <div class="footer__left"></div>
        </div>
    </div>
</template>

<script lang="ts">
interface Iobject {
  [key: string]: any
}

export default {
  name: 'Footer',
  components: {},
  data(): Iobject {
    return {}
  },
  computed: {

  },
  methods: {

  },
}
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';

.footer {
    position: fixed;
    width: 100%;
    top: auto;
    bottom: 0;
    left: 0;
    background: #FFFFFF;

  .footer-center {
    min-width: $min-width-body;
    max-width: $max-width-body;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer__right,
  .footer__left {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;

    .footer__item {
        display: inline-block;
        margin-right: 35px;
    }

    a {
        font-size: 15px;
        line-height: 18px;
        color: $font-color;
        font-family: $font-bold;
        text-decoration: none;
    }
  }

  .footer__left {

    .footer__item {
        margin-right: 0;
        margin-left: 35px;
    }
  }

}
</style>
