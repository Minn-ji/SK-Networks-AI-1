<template>
    <v-app-bar color="#004804" app dark height="64">
        <v-btn @click="goToHome">
            <v-toolbar-title class="text-uppercase text--darken-4">
                <span>GET YOUR Tumbler ✨</span>
            </v-toolbar-title>
        </v-btn>
        <v-spacer></v-spacer>

        <!-- <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="white" v-bind="props">
                    <b>Activator Slot</b>
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in items" 
                            :key="index" :value="index" @click="item.action">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu> -->

        <v-btn text @click="goToProductList" class="btn-text">
            <v-icon left>mdi-store</v-icon>
            <span>상품</span>
        </v-btn>
        <v-btn text @click="goToBoardList" class="btn-text">
            <v-icon left>mdi-forum</v-icon>
            <span>게시판</span>
        </v-btn>
        <v-btn v-if="!isLogin" text @click="signIn" class="btn-text">
            <v-icon left>mdi-login</v-icon>
            <span>로그인</span>
        </v-btn>
        <v-btn v-if="isLogin" text @click="signOut" class="btn-text">
            <v-icon left>mdi-logout</v-icon>
            <span>로그아웃</span>
        </v-btn>
    </v-app-bar>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router'

export default {
    data () {
        return {
            navigation_drawer: false,
            // links: [{ icon: 'mdi-home', action: this.goToHome, route: '/' }],
            accessToken: null,
            isLogin: false,
            // items: [
            //     { title: 'Product', action: this.goToProductList() },
            //     { title: 'Board', action: this.goToBoardList() },
            // ]
        }
    },
    methods: {
        goToHome () {
            router.push('/')
        },
        goToProductList () {
            router.push('/product/list')
        },
        goToBoardList () {
            router.push('/board/list')
        },
        signIn () {
            router.push('/account/login')
        },
        signOut () {
            localStorage.removeItem("accessToken")
            this.isLogin = false
            router.push('/') // 홈페이지(가장 상위)로 돌아감
        }
    },
    mounted () {
        this.accessToken = localStorage.getItem("accessToken")
        this.isLogin = !!this.accessToken
        // TODO: 로그인 이후 즉시 로그아웃 화면 갱신 안되는 문제 발견
        //       새로고침하면 반영됨
    }
}
</script>