RemoteStorage.defineModule('music', function(privateClient, publicClient) {
  return {
    exports: {
      dontSync: function () {
        privateClient.cache('', 'FLUSH');
        publicClient.cache('', 'FLUSH');
      },
      getListing: function(path) {
        return publicClient.getListing(path);
      },
      getSongURL: function(path) {
        return publicClient.getItemURL(path);
      }
    }
  };
});
