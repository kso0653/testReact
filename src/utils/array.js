export default {

    /**
     * 배열 자르기
     * @param arr 원본 배열
     * @param n 자를 개수
     * @returns {*[]} 2차원 배열 ex) [ [1,2], [3,4] ]
     */
    division: function (arr, n) {
        const copyArr = JSON.parse(JSON.stringify(arr));
        const len = copyArr.length;
        const cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
        let divisionArr = [];

        for (let i=0; i < cnt; i++){
            divisionArr.push(copyArr.splice(0, n));
        }

        return divisionArr;
    }
}