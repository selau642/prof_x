"replacerules.rules": {
    "Add //": {
        "find": "^(?!\s*\/\/#)(.*)", 
        "des":"find not space //#",
        "replace": "//$1",
        "flags":"gm",
        "languages": [
            "javascript",
            "svelte"
        ],
    },
    "Remove //#": {
        "find": "^(\s*)\/\/#(.*)",
        "des": "find space //#",
        "replace": "$1$2",
        "flags":"gm",
        "languages":[
            "javascript",
            "svelte"
        ]
    },
    "Add //#":{
        "find": "^(?!\s*\/\/)(.*)", 
        "des":"find not space //",
        "replace": "//#$1",
        "flags":"gm",
        "languages":[
            "javascript",
            "svelte"
        ],
    },
    "Remove //":{
        "find": "^^\s*\/\/(?!#)(.*)", 
        "des":"find not space //# but only //",
        "replace":"$1",
        "flags":"gm",
        "languages":[
            "javascript", 
            "svelte"
        ]
    }
}

"replacerules.rulesets": {
    "Show Decision Tree": {
        "rules": [
            "Add //",
            "Remove //#"
        ]
    },

    "Hide Decision Tree":{
        "rules":[
            "Add //#",
            "Remove //"
        ]
    }
}