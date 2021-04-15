# Trusted Timestamp Implementation (RFC3161)

This lib/package was based entirely on the [https://d-mueller.de/blog/dealing-with-trusted-timestamps-in-php-rfc-3161/](https://d-mueller.de/blog/dealing-with-trusted-timestamps-in-php-rfc-3161/) implementation originally made in php.

## Requirements

- Openssl
- curl
- Node 8+

## Reference

## RFC3161

- [https://www.ietf.org/rfc/rfc3161.txt](https://www.ietf.org/rfc/rfc3161.txt)

## List Free Timestamp Authority

- [https://freetsa.org/tsr](https://freetsa.org/tsr)
- [http://sha256timestamp.ws.symantec.com/sha256/timestamp](http://sha256timestamp.ws.symantec.com/sha256/timestamp)
- [http://timestamp.entrust.net/TSS/RFC3161sha2TS](http://timestamp.entrust.net/TSS/RFC3161sha2TS)
- [http://timestamp.apple.com/ts01](http://timestamp.apple.com/ts01)

## TODO

- [ ] Improve README
- [ ] Add JSDOC
- [ ] Mock tests
- [ ] Add signature verification function (only works with time certificate)
