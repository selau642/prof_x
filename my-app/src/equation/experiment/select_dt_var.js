{
  "tree": {
    "write": {
      "select": [
        2
      ],
      "select_up": [
        6
      ]
    },
    "read": {
      "build_subformula_downward": [
        2
      ],
      "select_up": [
        3
      ],
      "if_all_child_selected": [
        2
      ],
      "build_subformula_upward": [
        2
      ],
      "if_not_root_then_recursive": [
        3
      ]
    }
  },
  "event_tree": {
    "write": {
      "select_up": [
        4
      ]
    },
    "read": {
      "if_is_item": [
        7
      ]
    }
  },
  "isRoot": {
    "write": {
      "select_up": [
        9
      ]
    },
    "read": {
      "if_not_root_then_recursive": [
        2
      ]
    }
  },
  "item_tree": {
    "write": {
      "setup_if_is_item": [
        19,
        29,
        56
      ]
    },
    "read": {
      "check_bracket_tree_for_match": [
        1
      ],
      "event_tree_show_multi_arrow": [
        2
      ]
    }
  },
  "item_type": {
    "write": {
      "setup_if_is_item": [
        20,
        30,
        57
      ]
    },
    "read": {
      "check_bracket_tree_for_match": [
        1
      ]
    }
  },
  "bracket_tree": {
    "write": {
      "setup_if_is_item": [
        21,
        31,
        58
      ]
    },
    "read": {
      "check_bracket_tree_for_match": [
        1
      ],
      "if_all_match_selected": [
        2
      ]
    }
  },
  "is_not_item": {
    "write": {
      "setup_if_is_item": [
        36,
        42,
        63
      ]
    },
    "read": {
      "loop_event_tree_child": [
        1
      ]
    }
  },
  "is_item_but_no_grand_parent_sibling": {
    "write": {
      "setup_if_is_item": [
        52
      ]
    },
    "read": {}
  },
  "yellow_arrow_list": {
    "write": {
      "loop_event_tree_child": [
        8
      ]
    },
    "read": {
      "loop_yellow_arrow_list": [
        1
      ]
    }
  },
  "event_child_sub_formula": {
    "write": {
      "loop_event_tree_child": [
        17
      ]
    },
    "read": {
      "if_same_yellow_item": [
        1
      ]
    }
  },
  "event_child_tree": {
    "write": {
      "loop_event_tree_child": [
        18
      ]
    },
    "read": {
      "if_same_yellow_item": [
        1
      ],
      "change_yellow_arrow_to_default_arrow": [
        2
      ]
    }
  },
  "arrow_item_full_name": {
    "write": {
      "loop_yellow_arrow_list": [
        4
      ]
    },
    "read": {
      "if_same_yellow_item": [
        2
      ]
    }
  },
  "item_depth": {
    "write": {
      "check_bracket_tree_for_match": [
        4
      ]
    },
    "read": {
      "if_match_depth_n_subformula": [
        2
      ]
    }
  },
  "item_sub_formula": {
    "write": {
      "check_bracket_tree_for_match": [
        5
      ]
    },
    "read": {
      "if_match_depth_n_subformula": [
        2
      ]
    }
  },
  "match_tree_list": {
    "write": {
      "check_bracket_tree_for_match": [
        6
      ]
    },
    "read": {
      "if_match_depth_n_subformula": [
        3
      ],
      "all_show_yellow_arrow": [
        1
      ]
    }
  },
  "match_tree_name_list": {
    "write": {
      "check_bracket_tree_for_match": [
        7
      ]
    },
    "read": {
      "if_match_depth_n_subformula": [
        3
      ],
      "all_show_yellow_arrow": [
        1
      ]
    }
  },
  "item_type_list": {
    "write": {
      "check_bracket_tree_for_match": [
        8
      ]
    },
    "read": {
      "if_match_depth_n_subformula": [
        3
      ],
      "all_show_yellow_arrow": [
        1
      ]
    }
  },
  "outer_item_name": {
    "write": {
      "check_bracket_tree_for_match": [
        16
      ]
    },
    "read": {
      "if_match_depth_n_subformula": [
        2
      ]
    }
  }
}