# builds webconsole in ci environment

# install tx client
TX_VERSION="v1.1.0"
if ! command -v tx &> /dev/null
then
  mkdir -p ~/bin ./tx_dst
  wget -O tx.tar.gz https://github.com/transifex/cli/releases/download/${TX_VERSION}/tx-linux-amd64.tar.gz
  tar xzf tx.tar.gz -C tx_dst
  mv tx_dst/tx ./tx
  rm tx_dst tx.tar.gz -rf
  _tx="./tx"
else
  _tx=tx
fi

echo "tx version:"
${_tx} --version
# push i18n source
echo "push tx source file"
${_tx} --token "${TX_TOKEN}" push --source 
# checkout the locale changes
echo "pull language files"
${_tx} --token "${TX_TOKEN}" pull --mode sourceastranslation --all --force

# install dependencies
yarn install

# build
CI=false yarn build
