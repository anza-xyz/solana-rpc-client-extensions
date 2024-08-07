use {
    solana_rpc_client::rpc_client::RpcClient,
    solana_rpc_get_stake_activation::get_stake_activation, solana_sdk::pubkey::Pubkey,
    std::str::FromStr,
};

fn main() {
    let stake = Pubkey::from_str("Bv33KFZT81nhk5FimTK1kNtz6fGh8fzzHSfLpbmDSsA5").unwrap();
    let rpc_client = RpcClient::new("https://api.testnet.solana.com");
    let activation_status = get_stake_activation(&rpc_client, &stake).unwrap();
    println!("Hello, {activation_status:?}!");
}
