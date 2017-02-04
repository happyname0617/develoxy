const usersHelper = (() => {
    let users = null;
    return {
        // 헬퍼 initialize
        initialize: (database) => {
            users = database.ref('/users/');
        },

        /* 탐색 */

        // 프로필 찾기
        findProfileById: (uid) => {
            return users.child('profiles').child(uid).once('value');
        },

        findProfileByIdSync: (uid, cb) => {
            const ref = users.child('profiles').child(uid);
            ref.on('value', cb)
            return ref;
        },

        // 계정 설정 찾기
        findSettingById: (uid) => {
            return users.child('settings').child(uid).once('value');
        },

        findProfileByUsername: (username) => {
            return users.child('settings').orderByChild('username')
                                          .equalTo(username)
                                          .once('child_added');
        },

        checkUsername: async (username) => {
            const data = await users.child('usernames').child(username).once('value');
            return { available: !data.exists() };
        },

        /* 수정 */

        /* 생성 */

        // username 정하기
        claimUsername: ({uid, username}) => {
            return users.child('usernames').child(username).set(uid);
        },

        // 유저 생성
        create: ({uid, username, displayName, email, thumbnail}) => {
            const profile = users.child('profiles').child(uid).set({
                username,
                displayName,
                thumbnail: 'https://firebasestorage.googleapis.com/v0/b/develoxy-2f498.appspot.com/o/static%2Fthumbnail.png?alt=media&token=ae708dc5-9bf0-4924-847e-8cf9e7ac176b'
            });

            const setting = users.child('settings').child(uid).set({
                email
                // 나중에 더 추가 할 것임
            });

            return Promise.all([profile, setting, username]);
        }
    }
})();

export default usersHelper;



// import * as firebase from 'firebase';

// export function findUserById(uid) {
//     return firebase.database().ref('/users/' + uid).once('value');
// }

// export function findUserByUsername(username) {
//     const ref = firebase.database().ref('/users/')
//     return ref.orderByChild('username').equalTo(username).once('child_added')
// }

// export function createUserData({user, username}) {
//     const { uid, email, photoURL, displayName} = user;
//     return firebase.database().ref('users/' + uid).set({
//         email,
//         photoURL, 
//         displayName,
//         username
//     });
// }

// // export function updateProviderData({uid, providerData}) {
// //     const updates = {
// //         ['users/' + uid + '/providerData']: providerData
// //     };
// //     return firebase.database().ref().update(updates);
// // }