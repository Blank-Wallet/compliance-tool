# Compliance tool

### Allows to obtain compliance information out of a deposit note string.

The package create an instance of InstanceDB to store all the Tornado deposits and withdrawal events
that are queried, which is why it is not currently compatible with node environments.

How to:

```ts
    import { isValidNoteString, getComplianceInformation } from "compliance-tool";

    ...

    // Check if note is valid
    const isValid: boolean = isValidNoteString('tornado-1-eth-1-0x...')

    // Obtain compliance report
    try {
        const complianceReport = 
            await getComplianceInformation('tornado-1-eth-1-0x...');
    } catch(error) {
        // Catch possible errors while generating report
    }
```

Compliance object type:

```ts
    type ComplianceInfo = {
        deposit: {
            pair: CurrencyAmountPair;
            spent: boolean;
            timestamp: Date;
            commitment: string;
            transactionHash: string;
            from: string;
        };
        withdrawal: {
            pair: CurrencyAmountPair;
            to: string;
            transactionHash: string;
            timestamp: Date;
            fee: string;
            nullifier: string;
        };
    };
```