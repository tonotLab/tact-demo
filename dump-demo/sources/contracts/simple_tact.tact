import "@stdlib/deploy";


contract SimpleTact with Deployable {

    init(){}

    receive("AskDump"){
        dump(">>>>>>>>>>>>>>>>>>>>>>>>>My first dump");
    }
}