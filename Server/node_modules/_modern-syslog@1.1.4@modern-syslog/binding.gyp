{
  "targets": [
    {
      "target_name": "core",
      "sources": [
        "core.cc"
      ],
      "include_dirs"  : [
            "<!(node -e \"require('nan')\")"
      ],
      "cflags": ["-g"]
    }
  ]
}
