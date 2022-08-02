let ReactDOM = require('react-dom');

export default {
    printContent: function(el) {
        var printContents = ReactDOM.findDOMNode(el).innerHTML;
        var WindowObject = window.open('', '', '');
        WindowObject.document.writeln(printContents);
        WindowObject.document.close();
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
    }
}
