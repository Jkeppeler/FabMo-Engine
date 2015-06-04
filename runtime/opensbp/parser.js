sbp_parser = require('./sbp_parser')
var log = require('../../log').logger('sbp');

parseLine = function(line) {
    line = line.replace(/\r/g,'');
    parts = line.split("'");
    statement = parts[0]
    comment = parts.slice(1,parts.length)
    obj =  sbp_parser.parse(statement)
    if(Array.isArray(obj)) {
    	obj = {"type":"comment", "comment":comment};
    } else {
    	if(comment != '') {obj.comment = comment}
    }
    if(obj.type == 'cmd') {
        obj.cmd = obj.cmd.toUpperCase();
    }
    return obj
}

parse = function(str) {
	output = []
	lines = str.split('\n');
    for(i=0; i<lines.length; i++) {
        console.log(i);
        try {            
            output.push(parseLine(lines[i]))
        } catch(err) {
            if(err.name == 'SyntaxError') {
                log.error("Syntax Error on line " + i)
                log.error("Expected " + err.expected.join(',') + " but found " + err.found)
                log.error(err.line)
                err.line = i+1;
            } else {
                log.error(err);
            }
            throw err
        }
    }
    return output
}


exports.parse = parse
