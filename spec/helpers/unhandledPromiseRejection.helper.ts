process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p);
});
