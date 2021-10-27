<template>
    <div class="header">
        <div class="header-center">
            <div class="header__right">
                <span class="header__item">
                    <img src="@/assets/images/logo.png" alt="" title="" />
                </span>
                <span class="header__item">
                    <router-link to="/">Главная</router-link>
                </span>
                <span class="header__item">
                    <router-link to="/canban">Сделки</router-link>
                </span>
                <span class="header__item">
                    <router-link to="#">Проекты</router-link>
                </span>
                <span class="header__item">
                    <router-link to="#">Компании</router-link>
                </span>
                <span class="header__item">
                    <router-link to="#">Контакты</router-link>
                </span>
            </div>

            <div class="header__left">
                <span class="header__item">
                    <router-link to="#">Профиль</router-link>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
interface Iobject {
  [key: string]: any
}

export default {
  name: 'Header',
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

.header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 20;
    background: #FFFFFF;

  .header-center {
    min-width: $min-width-body;
    max-width: $max-width-body;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header__right,
  .header__left {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;

    .header__item {
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

  .header__left {

    .header__item {
        margin-right: 0;
        margin-left: 35px;
    }
  }

}
</style>
