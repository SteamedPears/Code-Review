// includes
var Sequelize = require("sequelize");
var DB_Info = require("./db_info");

// make the db connection
var sequelize = new Sequelize(DB_Info.db,DB_Info.user,DB_Info.pw);

// import the models
var Language = sequelize.import(__dirname + "/language");

// do it
Language.drop().success(function() {
    Language.sync().success(function() {

	Language.build({
	    mode: 'none',
	    description: 'Plain Text'
	}).save();

	Language.build({
	    mode: 'asp',
	    description: 'ASP.NET'
	}).save();

	Language.build({
	    mode: 'c',
	    description: 'C'
	}).save();

	Language.build({
	    mode: 'cpp',
	    description: 'C++'
	}).save();

	Language.build({
	    mode: 'csharp',
	    description: 'C#'
	}).save();

	Language.build({
	    mode: 'clojure',
	    description: 'Clojure'
	}).save();

	Language.build({
	    mode: 'coffeescript',
	    description: 'CoffeeScript'
	}).save();

	Language.build({
	    mode: 'css',
	    description: 'CSS'
	}).save();

	Language.build({
	    mode: 'diff',
	    description: 'diff'
	}).save();

	Language.build({
	    mode: 'ecl',
	    description: 'ECL'
	}).save();

	Language.build({
	    mode: 'ejs',
	    description: 'Embedded Javascript'
	}).save();

	Language.build({
	    mode: 'erlang',
	    description: 'Erlang'
	}).save();

	Language.build({
	    mode: 'gfm',
	    description: 'Github Flavored Markdown'
	}).save();

	Language.build({
	    mode: 'go',
	    description: 'Go'
	}).save();

	Language.build({
	    mode: 'groovy',
	    description: 'Groovy'
	}).save();

	Language.build({
	    mode: 'haskell',
	    description: 'Haskell'
	}).save();

	Language.build({
	    mode: 'haxe',
	    description: 'Haxe'
	}).save();

	Language.build({
	    mode: 'html',
	    description: 'HTML'
	}).save();

	Language.build({
	    mode: 'htmlmixed',
	    description: 'HTML/Javascript/CSS'
	}).save();

	Language.build({
	    mode: 'java',
	    description: 'Java'
	}).save();

	Language.build({
	    mode: 'javascript',
	    description: 'Javascript'
	}).save();

	Language.build({
	    mode: 'jinja2',
	    description: 'Jinja2'
	}).save();

	Language.build({
	    mode: 'json',
	    description: 'JSON'
	}).save();

	Language.build({
	    mode: 'jsp',
	    description: 'JSP'
	}).save();

	Language.build({
	    mode: 'latex',
	    description: 'LaTeX'
	}).save();

	Language.build({
	    mode: 'less',
	    description: 'LESS'
	}).save();

	Language.build({
	    mode: 'lua',
	    description: 'Lua'
	}).save();

	Language.build({
	    mode: 'markdown',
	    description: 'Markdown'
	}).save();

	Language.build({
	    mode: 'mysql',
	    description: 'MySQL'
	}).save();

	Language.build({
	    mode: 'ntriples',
	    description: 'NTriples'
	}).save();

	Language.build({
	    mode: 'ocaml',
	    description: 'OCaml'
	}).save();

	Language.build({
	    mode: 'pascal',
	    description: 'Pascal'
	}).save();

	Language.build({
	    mode: 'perl',
	    description: 'Perl'
	}).save();

	Language.build({
	    mode: 'php',
	    description: 'PHP'
	}).save();

	Language.build({
	    mode: 'pig',
	    description: 'Pig Latin'
	}).save();

	Language.build({
	    mode: 'plsql',
	    description: 'PL/SQL'
	}).save();

	Language.build({
	    mode: 'properties',
	    description: 'Properties file (ini)'
	}).save();

	Language.build({
	    mode: 'python2',
	    description: 'Python 2'
	}).save();

	Language.build({
	    mode: 'python3',
	    description: 'Python 3'
	}).save();

	Language.build({
	    mode: 'r',
	    description: 'R'
	}).save();

	Language.build({
	    mode: 'rpm-spec',
	    description: 'RPM (spec)'
	}).save();

	Language.build({
	    mode: 'rpm-changes',
	    description: 'RPM (changeset)'
	}).save();

	Language.build({
	    mode: 'rst',
	    description: 'reStructuredText'
	}).save();

	Language.build({
	    mode: 'ruby',
	    description: 'Ruby'
	}).save();

	Language.build({
	    mode: 'rust',
	    description: 'Rust'
	}).save();

	Language.build({
	    mode: 'scala',
	    description: 'Scala'
	}).save();

	Language.build({
	    mode: 'scheme',
	    description: 'Scheme'
	}).save();

	Language.build({
	    mode: 'shell',
	    description: 'Shell'
	}).save();

	Language.build({
	    mode: 'smalltalk',
	    description: 'Smalltalk'
	}).save();

	Language.build({
	    mode: 'smarty',
	    description: 'Smarty'
	}).save();

	Language.build({
	    mode: 'sparql',
	    description: 'SPARQL'
	}).save();

	Language.build({
	    mode: 'stex',
	    description: 'sTeX'
	}).save();

	Language.build({
	    mode: 'tiddlywiki',
	    description: 'Tiddlywiki'
	}).save();

	Language.build({
	    mode: 'tikiwiki',
	    description: 'Tiki wiki'
	}).save();

	Language.build({
	    mode: 'vbscript',
	    description: 'VPScript'
	}).save();

	Language.build({
	    mode: 'velocity',
	    description: 'Velocity'
	}).save();

	Language.build({
	    mode: 'verilog',
	    description: 'Verilog'
	}).save();

	Language.build({
	    mode: 'xml',
	    description: 'XML'
	}).save();

	Language.build({
	    mode: 'xquery',
	    description: 'XQuery'
	}).save();

	Language.build({
	    mode: 'yaml',
	    description: 'YAML'
	}).save();
    });
});
