import React from 'react';

function Panel({ user }) {
  // Check if user is available before trying to access its properties
  if (!user) {
    return <p>Loading user data...</p>;  // Show a loading message or spinner
  }

  return (
    <div className="p-4">
      {/* Handle cases where the username might be undefined */}
      <h2 className="text-xl font-semibold mb-4">
        Përshëndetje, {user.username ? user.username : 'Mik'}!
      </h2>
      <p className="text-gray-700">
        Mirë se erdhët në panelin tuaj të llogarisë. Këtu mund të shihni porositë tuaja, të administroni adresat, dhe të përditësoni të dhënat e llogarisë suaj.
        Nëse keni ndonjë pyetje, jemi këtu për t'ju ndihmuar!
      </p>
    </div>
  );
}

export default Panel;
