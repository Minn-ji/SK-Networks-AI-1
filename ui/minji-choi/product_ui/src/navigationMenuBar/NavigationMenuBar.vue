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
        <v-btn text @click="goToPostList" class="btn-text">
            <v-icon left>mdi-pen-off</v-icon>
            <span>익명 게시판</span>
        </v-btn>
        <v-btn text @click="goToCartList" class="btn-text">
            <v-icon left>mdi-cart</v-icon>
            <span>장바구니</span>
        </v-btn>
        <v-btn v-if="!isAuthenticated" text @click="signIn" class="btn-text">
            <v-icon left>mdi-login</v-icon>
            <span>로그인</span>
        </v-btn>
        <v-btn v-if="isAuthenticated" text @click="signOut" class="btn-text">
            <v-icon left>mdi-logout</v-icon>
            <span>로그아웃</span>
        </v-btn>
    </v-app-bar>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router'
import { mapState, mapActions } from 'vuex'
const authenticationModule = 'authenticationModule'

export default {
    data () {
        return {
            navigation_drawer: false,
            // links: [{ icon: 'mdi-home', action: this.goToHome, route: '/' }],
            accessToken: null,
            isLogin: !!localStorage.getItem('userToken'),
            // items: [
            //     { title: 'Product', action: this.goToProductList() },
            //     { title: 'Board', action: this.goToBoardList() },
            // ]
        }
    },
    computed: {
        ...mapState(authenticationModule, ['isAuthenticated']),
    },
    methods: {
        ...mapActions(authenticationModule, ['requestLogoutToDjango']),
        goToHome () {
            router.push('/')
        },
        goToProductList () {
            router.push('/product/list')
        },
        goToBoardList () {
            router.push('/board/list')
        },
        goToCartList () {
            router.push ('/cart/list')
        },
        goToPostList () {
            router.push('/post/list')
        },
        signIn () {
            router.push('/account/login')
        },
        signOut () {
            this.requestLogoutToDjango()
            router.push('/')
        },
        updateLoginStatus () {
            this.userToken = localStorage.getItem("userToken")
            this.isLogin = !!this.userToken
        }
    },
    mounted () {
        this.updateLoginStatus()
        window.addEventListener('storage', this.updateLoginStatus)
    },
    beforeUnmount () {
        window.removeEventListener('storage', this.updateLoginStatus)
    },
}
</script>