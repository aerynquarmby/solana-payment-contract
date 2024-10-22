/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_contract.json`.
 */
export type SolanaContract = {
  "address": "93PpL2ZKMWvBhhQ6VYNiHmJPNrVANUH8kcW5UpU6dzjM",
  "metadata": {
    "name": "solanaContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addToWhitelist",
      "discriminator": [
        157,
        211,
        52,
        54,
        144,
        81,
        5,
        55
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "approveDelegate",
      "discriminator": [
        68,
        6,
        248,
        64,
        195,
        222,
        182,
        223
      ],
      "accounts": [
        {
          "name": "restritedAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "to",
          "writable": true
        },
        {
          "name": "delegate",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
      "name": "changeAccountOwner",
      "discriminator": [
        204,
        141,
        65,
        83,
        37,
        61,
        187,
        173
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "changeOwnerShip",
      "discriminator": [
        122,
        36,
        20,
        180,
        92,
        156,
        202,
        154
      ],
      "accounts": [
        {
          "name": "currentAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "programId",
          "writable": true
        },
        {
          "name": "programData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "programId"
              }
            ]
          }
        },
        {
          "name": "newAuthority"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "bpfUpgradableLoader",
          "address": "BPFLoaderUpgradeab1e11111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initTokenProgram",
      "discriminator": [
        240,
        88,
        37,
        106,
        172,
        180,
        164,
        104
      ],
      "accounts": [
        {
          "name": "programStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mintAddress"
              }
            ]
          }
        },
        {
          "name": "vault"
        },
        {
          "name": "mintAddress"
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initWallet",
      "discriminator": [
        141,
        132,
        233,
        130,
        168,
        183,
        10,
        119
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "purchaseProcess",
      "discriminator": [
        46,
        177,
        133,
        191,
        58,
        138,
        95,
        164
      ],
      "accounts": [
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "restritedAccount",
          "writable": true
        },
        {
          "name": "buyer",
          "signer": true
        },
        {
          "name": "source",
          "writable": true
        },
        {
          "name": "merchantTokenAccount",
          "writable": true
        },
        {
          "name": "feeWalletTokenAccount",
          "writable": true
        },
        {
          "name": "pdaTokenAccount",
          "writable": true
        },
        {
          "name": "delegate"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
      "name": "removeFromWhitelist",
      "discriminator": [
        7,
        144,
        216,
        239,
        243,
        236,
        193,
        235
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "restrictedBalanceDeposit",
      "discriminator": [
        174,
        131,
        137,
        8,
        246,
        158,
        64,
        176
      ],
      "accounts": [
        {
          "name": "restritedAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "programStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mintAddress"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "mintAddress"
        },
        {
          "name": "source",
          "writable": true
        },
        {
          "name": "to",
          "writable": true
        },
        {
          "name": "delegate"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setFeeWallet",
      "discriminator": [
        108,
        242,
        79,
        79,
        203,
        119,
        109,
        211
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "feeWallet",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "restrictedAccount",
      "discriminator": [
        25,
        15,
        213,
        98,
        43,
        1,
        244,
        213
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "events": [
    {
      "name": "processPurchaseEvent",
      "discriminator": [
        54,
        193,
        204,
        89,
        173,
        113,
        108,
        30
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "notWhitelisted",
      "msg": "Not Whitelisted"
    },
    {
      "code": 6002,
      "name": "userAlreadyWhitelisted",
      "msg": "User is already whitelisted"
    },
    {
      "code": 6003,
      "name": "userNotWhitelisted",
      "msg": "User is not whitelisted"
    },
    {
      "code": 6004,
      "name": "invalidFee",
      "msg": "Invalid fee basis points."
    },
    {
      "code": 6005,
      "name": "insufficientFundsForFees",
      "msg": "Insufficient funds after fees."
    },
    {
      "code": 6006,
      "name": "unauthorizedDelegate",
      "msg": "Unauthorized delegate."
    },
    {
      "code": 6007,
      "name": "restrictedAccount",
      "msg": "Restricted account."
    },
    {
      "code": 6008,
      "name": "invalidDelegate",
      "msg": "Invalid delegate provided."
    },
    {
      "code": 6009,
      "name": "overFlowError",
      "msg": "number error overflow"
    }
  ],
  "types": [
    {
      "name": "processPurchaseEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "purchaser",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "sellerWallet",
            "type": "pubkey"
          },
          {
            "name": "feeWallet",
            "type": "pubkey"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "restrictedAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userAddress",
            "type": "pubkey"
          },
          {
            "name": "balance",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "whitelist",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "feewallet",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
