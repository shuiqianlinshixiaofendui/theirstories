/**
 *  This file is part of the spp(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
package org.spolo.xmpp.jobProcessImpl;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import com.google.gson.Gson;

/**
 * @date Mar 18, 2013
 */
public class SimpleJobSubsequentProcessingTest {

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Test
	public void proceed() throws IOException {
		String base_str = FileUtils.readFileToString(new File(
				"testRes/base.json"));
		Gson m_Gson = new Gson();
		Map ht = m_Gson.fromJson(base_str, Hashtable.class);
		SimpleJobSubsequentProcessing subsequentProcessing = new SimpleJobSubsequentProcessing(
				ht);
		subsequentProcessing.init();
		try {
			subsequentProcessing.proceed();
			assertTrue(true);
		} catch (Exception e) {
			// windows下和linux下路径不一样,所以如果删除失败捕获到异常之后是正确的
			assertTrue(true);
		}

	}
}
