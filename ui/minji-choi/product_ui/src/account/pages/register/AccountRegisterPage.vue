<template>
    <v-container class="register-container" fill-height>
        <v-row align="center" justify="center">
            <v-col cols="12" md="8" lg="6">
                <v-card>
                    <v-card-title>
                        <span class="headline">신규 회원 신청</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref=form v-model="formValid" lazy-validation>
                            <v-text-field
                                    v-model="email"
                                    label="Email"
                                    required
                                    :rules="emailRules"
                                    :disabled="true"/>
                            <v-row align="center">
                                <v-col cols="10">
                                    <v-text-field
                                        v-model="nickname"
                                        label="Nickname"
                                        required
                                        :rules="nicknameRules"
                                        :error-message="nicknameErrorMessages"/>
                                </v-col>
                                <v-col cols="2">
                                    <v-btn color="primary" @click="checkNicknameDuplication" class="check-button" small>
                                        중복 검사
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-action>
                        <v-spacer></v-spacer>
                        <v-btn color="primary"
                                @click="submitForm"
                                :disabled="!isValidForSubmission">
                                신청하기
                            </v-btn>
                    </v-card-action>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'

const authenticationModule = 'authenticationModule' // 왜 이렇게 하냐 ? store를 도메인 단위로 나눠서 사용하기 위함이었음
const accountModule = 'accountModule'

export default {
    data () {
        return {
            formValid: false,
            email: '',
            nickname: '',
            emailRules: [
                v => !!v || 'Email은 필수입니다.', // v : vector, !! 이중 부정
                v => /.+@.+\..+/.test(v) || '유효한 Email 주소를 입력하세요.' 
                // .+ = '.' 앞에 최소 한 글자가 오고 무슨 글자가 온 다음 .이 온다
            ],
            nicknameRules: [v => !!v || 'Nickname은 필수입니다.'],
            nicknameErrorMessages: [],
            isNicknameValid: false,
          
        }
    },
    async created () {
        await this.requestUserInfo()
    },
    computed :{
        isValidForSubmission () {
            return this.formValid && this.isNicknameValid
        },
    },
    methods: {
        ...mapActions(authenticationModule, ['requestUserInfoToDjango']),
        ...mapActions(accountModule, ['requestNicknameDuplicationCheckToDjango', 'requestCreateNewAccountToDjango']),

        async requestUserInfo () {
            try {
                const userInfo = await this.requestUserInfoToDjango()
                this.email = userInfo.kakao_account.email
            } catch (error) {
                console.log('에러: ', error)
                alert('사용자 정보를 가져오는데 실패하였습니다.')
            }
        },
        async checkNicknameDuplication () {
            console.log('닉네임 중복검사 누름')
            try {
                const isDuplicate = await this.requestNicknameDuplicationCheckToDjango({
                    newNickname : this.nickname.trim() // 지저분한 띄어쓰기 제거, 중괄호로 묶어서 보낸다? payload
                })
                
                if (isDuplicate) {
                    this.nicknameErrorMessages = ['이 nickname은 이미 사용중입니다!']
                    this.isNicknameValid = false
                } else {
                    this.nicknameErrorMessages = []
                    this.isNicknameValid = true
                }
            } catch (error) {
                alert ('닉네임 중복 확인에 실패했습니다.')
                this.isNicknameValid = false
            }
        },
        async submitForm () {
            console.log('신청하기활성화')
            if (this.$refs.form.validate()) {
                const accountInfo = {
                    email: this.email,
                    nickname: this.nickname,

                }
                await this.requestCreateNewAccountToDjango(accountInfo)
                console.log('전송한 데이터 : ', accountInfo)
                alert('완료되었습니다.')
                this.$router.push('/')
            }
        }
    }
}
</script>