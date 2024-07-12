export type SolanaContract = {
  "version": "0.1.0",
  "name": "solana_contract",
  "instructions": [
    {
      "name": "initWallet",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addToWhitelist",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setFeeWallet",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "feeWallet",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeFromWhitelist",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "purchaseProcess",
      "accounts": [
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeWalletTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "merchantFeeBps",
          "type": "u64"
        },
        {
          "name": "feeWalletBps",
          "type": "u64"
        }
      ]
    },
    {
      "name": "approveDelegate",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeOwnerShip",
      "accounts": [
        {
          "name": "currentAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bpfUpgradableLoader",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "whitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "feewallet",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ProcessPurchaseEvent",
      "fields": [
        {
          "name": "purchaser",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sellerWallet",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeWallet",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fee",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6001,
      "name": "NotWhitelisted",
      "msg": "Not Whitelisted"
    },
    {
      "code": 6002,
      "name": "UserAlreadyWhitelisted",
      "msg": "User is already whitelisted"
    },
    {
      "code": 6003,
      "name": "UserNotWhitelisted",
      "msg": "User is not whitelisted"
    }
  ]
};

export const IDL: SolanaContract = {
  "version": "0.1.0",
  "name": "solana_contract",
  "instructions": [
    {
      "name": "initWallet",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addToWhitelist",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setFeeWallet",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "feeWallet",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeFromWhitelist",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "purchaseProcess",
      "accounts": [
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merchantTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeWalletTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "merchantFeeBps",
          "type": "u64"
        },
        {
          "name": "feeWalletBps",
          "type": "u64"
        }
      ]
    },
    {
      "name": "approveDelegate",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "changeOwnerShip",
      "accounts": [
        {
          "name": "currentAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bpfUpgradableLoader",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "whitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "feewallet",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ProcessPurchaseEvent",
      "fields": [
        {
          "name": "purchaser",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sellerWallet",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeWallet",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fee",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6001,
      "name": "NotWhitelisted",
      "msg": "Not Whitelisted"
    },
    {
      "code": 6002,
      "name": "UserAlreadyWhitelisted",
      "msg": "User is already whitelisted"
    },
    {
      "code": 6003,
      "name": "UserNotWhitelisted",
      "msg": "User is not whitelisted"
    }
  ]
};
