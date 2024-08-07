use {
    solana_rpc_client::rpc_client::RpcClient,
    solana_rpc_client_api::client_error::{Error, ErrorKind, Result as ClientResult},
    solana_sdk::{
        account::{from_account, ReadableAccount},
        pubkey::Pubkey,
        stake::state::{StakeActivationStatus, StakeStateV2},
        stake_history::StakeHistory,
        sysvar::stake_history,
    },
    serde::{Deserialize, Serialize},
    std::str::FromStr,
};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
enum StakeActivationState {
    Activating,
    Active,
    Deactivating,
    Inactive
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct StakeActivation {
    state: StakeActivationState,
    active: u64,
    inactive: u64,
}

fn get_stake_activation(rpc_client: &RpcClient, stake: &Pubkey) -> ClientResult<StakeActivation> {
    let stake_account = rpc_client.get_account(stake)?;
    let stake_history_account = rpc_client.get_account(&stake_history::id())?;
    let epoch_info = rpc_client.get_epoch_info()?;
    let stake_state = bincode::deserialize::<StakeStateV2>(&stake_account.data).map_err(|_| Error::from(ErrorKind::Custom("Invalid param: stake account not initialized".to_string())))?;
    let delegation = stake_state.delegation();
    let rent_exempt_reserve = stake_state
        .meta()
        .ok_or_else(|| {
            Error::from(ErrorKind::Custom("Invalid param: stake account not initialized".to_string()))
        })?
        .rent_exempt_reserve;

    let delegation = match delegation {
        None => {
            return Ok(StakeActivation {
                state: StakeActivationState::Inactive,
                active: 0,
                inactive: stake_account.lamports().saturating_sub(rent_exempt_reserve),
            })
        }
        Some(delegation) => delegation,
    };

    let stake_history = from_account::<StakeHistory, _>(&stake_history_account)
            .ok_or(Error::from(ErrorKind::Custom("Invalid param: stake history not deserializable".to_string())))?;

    let StakeActivationStatus {
        effective,
        activating,
        deactivating,
    } = delegation.stake_activating_and_deactivating(
        epoch_info.epoch,
        &stake_history,
        Some(0),
    );
    let stake_activation_state = if deactivating > 0 {
        StakeActivationState::Deactivating
    } else if activating > 0 {
        StakeActivationState::Activating
    } else if effective > 0 {
        StakeActivationState::Active
    } else {
        StakeActivationState::Inactive
    };
    let inactive_stake = stake_account
        .lamports()
        .saturating_sub(effective)
        .saturating_sub(rent_exempt_reserve);
    Ok(StakeActivation {
        state: stake_activation_state,
        active: effective,
        inactive: inactive_stake,
    })
}

fn main() {
    let stake = Pubkey::from_str("Bv33KFZT81nhk5FimTK1kNtz6fGh8fzzHSfLpbmDSsA5").unwrap();
    let rpc_client = RpcClient::new("https://api.testnet.solana.com");
    let activation_status = get_stake_activation(&rpc_client, &stake).unwrap();
    println!("Hello, {activation_status:?}!");
}
