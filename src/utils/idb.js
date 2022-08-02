/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from 'jquery'
import 'jquery.cookie'
import aes256 from './aes256'
import ajax from './ajax'

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");
let detector = require('detector');
import idb from 'idb';

export default {

    /**
     * indexedDB 저장
     * @param data
     * @param options
     * @return {Promise<any>}
     */
    setItem: function (data, options) {

        let target = this;
        return new Promise(function (resolve, reject) {

            let required = target.required(options);
            if (required.resultCode === "0000" && required.resultData !== undefined)
                options = required.resultData;
            else
                reject(required);

            // 실행
            target.dbOpen(options).then((db) => {

                const dbStore = options.store;

                // 데이터베이스 내부에 스토어와 함께 새로운 읽기/쓰기 트랜잭션을 연다
                const transaction = db.transaction(dbStore, 'readwrite');
                const store = transaction.objectStore(dbStore);

                // 스토어에 데이터를 추가한다
                store.put(data);

                // 트랜잭션을 완료한다
                return transaction.complete;

            });
        });
    },

    /**
     * indexedDB 검색 - 단건
     * @param pk
     * @param options
     * @return {Promise<any>}
     */
    getItem: function (pk, options) {

        let target = this;
        return new Promise(function (resolve, reject) {

            let required = target.required(options);
            if (required.resultCode === "0000" && required.resultData !== undefined)
                options = required.resultData;
            else
                reject(required);

            // 실행
            target.dbOpen(options).then((db) => {

                const dbStore = options.store;

                // 데이터베이스 내부에 스토어와 함께 새로운 읽기 전용 트랜잭션을 연다
                const transaction = db.transaction(dbStore);
                const store = transaction.objectStore(dbStore);

                // 데이터를 반환한다
                return store.get(pk);
            }).then((item) => {
                resolve(item);
            });

        });

        // return promise;

    },

    /**
     * indexedDB 검색 - 여러건
     * @param pk
     * @param options
     * @return {Promise<any>}
     */
    getItemAll: function (pk, options) {

        let target = this;
        return new Promise(function (resolve, reject) {

            let required = target.required(options);
            if (required.resultCode === "0000" && required.resultData !== undefined)
                options = required.resultData;
            else
                reject(required);

            // 실행
            target.dbOpen(options).then((db) => {

                const dbStore = options.store;

                // 데이터베이스 내부에 스토어와 함께 새로운 읽기 전용 트랜잭션을 연다
                const transaction = db.transaction(dbStore);
                const store = transaction.objectStore(dbStore);

                // 데이터를 반환한다
                return store.getAll(pk);
            }).then((item) => {
                resolve(item);
            });

        });

    },

    /**
     * indexedDB 검색 - index 단건
     * @param pk
     * @param ix
     * @param options
     * @return {Promise<any>}
     */
    getIndexItem: function (pk, ix, options) {

        let target = this;
        return new Promise(function (resolve, reject) {

            let required = target.required(options);
            if (required.resultCode === "0000" && required.resultData !== undefined)
                options = required.resultData;
            else
                reject(required);

            // 실행
            target.dbOpen(options).then((db) => {

                const dbStore = options.store;

                // 데이터베이스 내부에 스토어와 함께 새로운 읽기 전용 트랜잭션을 연다
                const transaction = db.transaction(dbStore);
                const store = transaction.objectStore(dbStore);

                let index = store.index(ix);

                // 데이터를 반환한다
                return index.get(pk);
            }).then((item) => {
                resolve(item);
            });

        });

    },

    /**
     * indexedDB 검색 - 인덱스 여러건
     * @param pk
     * @param ix
     * @param options
     * @return {Promise<any>}
     */
    getIndexItemAll: function (pk, ix, options) {

        let target = this;
        return new Promise(function (resolve, reject) {

            let required = target.required(options);
            if (required.resultCode === "0000" && required.resultData !== undefined)
                options = required.resultData;
            else
                reject(required);

            // 실행
            target.dbOpen(options).then((db) => {

                const dbStore = options.store;

                // 데이터베이스 내부에 스토어와 함께 새로운 읽기 전용 트랜잭션을 연다
                const transaction = db.transaction(dbStore);
                const store = transaction.objectStore(dbStore);

                let index = store.index(ix);

                // 데이터를 반환한다
                return index.getAll(pk);
            }).then((item) => {
                resolve(item);
            });

        });

    },

    /**
     * indexedDB 삭제
     * @param pk
     * @param options
     * @return {Promise<any>}
     */
    removeItem: function (pk, options) {

        let target = this;
        return new Promise(function (resolve, reject) {

            let required = target.required(options);
            if (required.resultCode === "0000" && required.resultData !== undefined)
                options = required.resultData;
            else
                reject(required);

            // 3. 실행
            target.dbOpen(options).then((db) => {
                const dbStore = options.store;

                // 데이터베이스 내부에 스토어와 함께 새로운 읽기 전용 트랜잭션을 연다
                const transaction = db.transaction(dbStore, 'readwrite');
                const store = transaction.objectStore(dbStore);

                // 데이터를 삭제한다
                store.delete(pk);

                // 트랜잭션을 완료한다
                return transaction.complete;
            });
        });
    },

    /**
     * indexedDB 접속
     * @param options
     * @return {Promise<DB>}
     */
    dbOpen: function (options) {
        return idb.open(options.db, options.version, function(upgradeDb) {
            // console.log(upgradeDb);
            // console.log(upgradeDb.objectStoreNames);
            // console.log(upgradeDb.transaction);

            const wehagoidb = upgradeDb.createObjectStore(options.store, {
                keyPath: options.pk
                // autoIncrement:true
            });

            console.log(options);
            console.log(typeof options.index);
            if (options.index !== undefined && (typeof options.index ===  "object" || typeof options.index ===  "Array")){

                for (let i = 0; i < options.index.length; i++) {
                    wehagoidb.createIndex(options.index[i], options.index[i], {unique: false});
                }
                //wehagoidb.createIndex("room_id", "room_id", {unique: false});
                //wehagoidb.createIndex("chat_id", "chat_id", {unique: false});
            }

        });



    },

    /**
     * indexedDB 사용가능 필수 체크
     * @param options
     * @return {*}
     */
    required: function (options) {

        // 1. indexedDB 사용 가능 여부
        if (!window.indexedDB) {
            console.log("indexedDB를 지원하지 않는 브라우저 입니다.");
            return {resultCode: '9000', resultMsg: 'indexedDB를 지원하지 않는 브라우저 입니다.'};
        }

        // 2. 필수정보 체크
        let defaults = {
            db: "wehago",
            version: 1
        };

        if (options || options === undefined) {
            options = $.extend(defaults, options);
        }

        if (options.store === undefined) {
            console.log("[store]는 필수정보 입니다.");
            return {resultCode: '8000', resultMsg: '[store]는 필수정보 입니다.'};
        }

        if (options.pk === undefined) {
            console.log("[pk]는 필수정보 입니다.");
            return {resultCode: '8000', resultMsg: '[pk]는 필수정보 입니다.'};
        }

        return {resultCode: '0000', resultMsg: 'success', resultData: options};
    }
};
