{
  "params": {
    "e_tree": "event_tree"
  },
  "names": {
    "p_tree": "parent_tree",
    "g_tree": "grand_parent_tree, this is usually the bracket_tree",
    "b_tree": "bracket_tree, the tree containing the bracket",
    "s_tree": "sibling_tree",
    "outer_item_tree": "box, bracket or items that showing arrows",
    "otv_var_name": "one_time_setup: set this variable first time and reuse"
  },
  "deselect": {
    "extract_e_tree_from_event": {},
    "if_e_tree_is_bracket": {
      "call_deselect_in": {},
      "e_tree_updateProps": {}
    },
    "call_deselect_up": {}
  },
  "deselect_in": {
    "if_e_tree_have_list": {
      "loop_child_tree_list": {
        "child_tree_deselect_n_hide_arrow": {},
        "if_child_tree_has_child": {
          "recursive_fn_deselect_in_child_tree": {}
        }
      }
    }
  },
  "deselect_up": {
    "climb_tree": {},
    "if_p_tree_is_selected": {
      "loop_all_siblings": {
        "if_is_sibling_tree": {
          "if_sibling_is_plus_minus_n_is_selected": {
            "deselect_s_tree": {}
          },
          "else_if_other_sibling": {
            "s_tree_show_default_arrow": {},
            "main_if_can_form_yellow_item_with_outer_tree": {
              "var_not_box": {},
              "ots_b_tree": {},
              "ots_bracket_tree_length": {},
              "var_bracket_not_single_child": {},
              "if_not_box_n_bracket_not_single_child": {
                "set_match_tree_list_with_s_tree": {},
                "ots_show_arrow_list": {},
                "loop_count_match_outer_tree": {
                  "if_same_depth": {
                    "if_same_sub_formula": {
                      "push_into_match_tree_list": {}
                    }
                  }
                },
                "if_found_all_matching_outer_item": {
                  "loop_all_match_item": {
                    "item_show_yellow_arrow": {},
                    "item_store_props_pasted_tree_names": {},
                    "item_updateProps": {}
                  }
                }
              }
            }
          }
        }
      },
      "if_p_tree_is_root": {
        "test": {
          "if_e_tree_is_box": {
            "e_tree_hide_arrow": {}
          },
          "else_if_is_bracket": {
            "e_tree_hide_arrow": {}
          }
        }
      },
      "else_if_not_root": {
        "p_tree_deselect": {},
        "recursive_fn_deselect_up_p_tree": {}
      }
    },
    "else_if_p_tree_not_selected": {
      "e_tree_show_arrow": {},
      "if_e_tree_not_box_n_is_yellow": {
        "main_change_outer_item_show_default_arrow": {
          "set_match_tree_list_with_blank": {},
          "loop_outer_item": {
            "ots_e_tree_depth": {},
            "if_outer_item_same_depth": {
              "ots_e_tree_sub_formula": {},
              "if_outer_item_same_sub_formula": {
                "push_into_match_tree_list": {}
              }
            }
          },
          "if_found_all_matching_outer_item": {
            "loop_all_match": {
              "item_show_multi_top_arrow": {},
              "item_store_props_pasted_tree_names": {},
              "item_updateProps": {}
            }
          }
        }
      }
    }
  }
}