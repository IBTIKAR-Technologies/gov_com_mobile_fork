package mr.gov.mtnima.govcom

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle
import org.devio.rn.splashscreen.SplashScreen;
import android.content.Intent;
import android.content.res.Configuration;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "RocketChatRN"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

	override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        SplashScreen.show(this, R.id.lottie)
        super.onCreate(null)
        Thread.sleep(3000)
        SplashScreen.setAnimationFinished(true)
        // sleep for 3 seconds
        // CompletableFuture.delayedExecutor(3, TimeUnit.SECONDS).execute {
        //     // Your code here executes after 3 seconds!
            
        // }
  }

  override fun invokeDefaultOnBackPressed() {
    moveTaskToBack(true)
  }

	// from react-native-orientation
	override fun onConfigurationChanged(newConfig: Configuration) {
		super.onConfigurationChanged(newConfig)
		val intent = Intent("onConfigurationChanged")
		intent.putExtra("newConfig", newConfig)
		sendBroadcast(intent)
	}
}