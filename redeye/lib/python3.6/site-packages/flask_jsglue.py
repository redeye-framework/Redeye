from flask import current_app, make_response, url_for
from jinja2 import Markup
import re, json

JSGLUE_JS_PATH = '/jsglue.js'
JSGLUE_NAMESPACE = 'Flask'
rule_parser = re.compile(r'<(.+?)>')
splitter = re.compile(r'<.+?>')


def get_routes(app):
    output = []
    for r in app.url_map.iter_rules():
        endpoint = r.endpoint
        rule = r.rule
        rule_args = [x.split(':')[-1] for x in rule_parser.findall(rule)]
        rule_tr = splitter.split(rule)
        output.append((endpoint, rule_tr, rule_args))
    return sorted(output, key=lambda x: len(x[1]), reverse=True)


class JSGlue(object):
    def __init__(self, app=None, **kwargs):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.app = app

        @app.route(JSGLUE_JS_PATH)
        def serve_js():
            return make_response(
                (self.generate_js(), 200, {'Content-Type': 'text/javascript'})
            )

        @app.context_processor
        def context_processor():
            return {'JSGlue': JSGlue}

    def generate_js(self):
        rules = get_routes(self.app)
        return """
var %s = new (function(){
    'use strict';
    return {
        '_endpoints': %s,
        'url_for': function(endpoint, rule) {
            if(typeof rule === "undefined") rule = {};

            var has_everything = false, url = "";

            var is_absolute = false, has_anchor = false, has_scheme;
            var anchor = "", scheme = "";

            if(rule['_external'] === true) {
                is_absolute = true;
                scheme = location.protocol.split(':')[0];
                delete rule['_external'];
            }

            if('_scheme' in rule) {
                if(is_absolute) {
                    scheme = rule['_scheme'];
                    delete rule['_scheme'];
                } else {
                    throw {name:"ValueError", message:"_scheme is set without _external."};
                }
            }

            if('_anchor' in rule) {
                has_anchor = true;
                anchor = rule['_anchor'];
                delete rule['_anchor'];
            }

            for(var i in this._endpoints) {
                if(endpoint == this._endpoints[i][0]) {
                    var url = '';
                    var j = 0;
                    var has_everything = true;
                    var used = {};
                    for(var j = 0; j < this._endpoints[i][2].length; j++) {
                        var t = rule[this._endpoints[i][2][j]];
                        if(typeof t === "undefined") {
                            has_everything = false;
                            break;
                        }
                        url += this._endpoints[i][1][j] + t;
                        used[this._endpoints[i][2][j]] = true;
                    }
                    if(has_everything) {
                        if(this._endpoints[i][2].length != this._endpoints[i][1].length)
                            url += this._endpoints[i][1][j];

                        var first = true;
                        for(var r in rule) {
                            if(r[0] != '_' && !(r in used)) {
                                if(first) {
                                    url += '?';
                                    first = false;
                                } else {
                                    url += '&';
                                }
                                url += r + '=' + rule[r];
                            }
                        }
                        if(has_anchor) {
                            url += "#" + anchor;
                        }

                        if(is_absolute) {
                            return scheme + "://" + location.host + url;
                        } else {
                            return url;
                        }
                    }
                }
            }

            throw {name: 'BuildError', message: "Couldn't find the matching endpoint."};
        }
    };
});""" % (JSGLUE_NAMESPACE, json.dumps(rules))

    @staticmethod
    def include():
        js_path = url_for('serve_js')
        return Markup('<script src="%s" type="text/javascript"></script>') % (js_path,)
